'use server'

import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function addTrade(formData: FormData): Promise<{ error?: string, success?: boolean }> {
  try {
    const pair = formData.get('pair') as string
  const direction = formData.get('direction') as 'BUY' | 'SELL'
  const entryPrice = parseFloat(formData.get('entryPrice') as string)
  const stopLoss = parseFloat(formData.get('stopLoss') as string)
  const takeProfit = parseFloat(formData.get('takeProfit') as string)
  
  const riskType = formData.get('riskType') as string
  const riskValue = parseFloat(formData.get('riskValue') as string)
  const riskPercent = riskType === 'PERCENT' && !isNaN(riskValue) ? riskValue : null
  const riskAmount = riskType === 'AMOUNT' && !isNaN(riskValue) ? riskValue : null

  const lotSize = parseFloat(formData.get('lotSize') as string)
  const notes = formData.get('notes') as string
  const setupTagName = formData.get('setupTag') as string | null
  const screenshotFile = formData.get('screenshot') as File | null

  // Convert image to base64
  let screenshotUrl: string | null = null;
  if (screenshotFile && screenshotFile.size > 0 && screenshotFile.name !== 'undefined') {
    const arrayBuffer = await screenshotFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    screenshotUrl = `data:${screenshotFile.type};base64,${buffer.toString('base64')}`;
  }

  // Calculate RR
  let rr: number | null = null;
  if (!isNaN(entryPrice) && !isNaN(stopLoss) && !isNaN(takeProfit)) {
    if (direction === 'BUY') {
      rr = (takeProfit - entryPrice) / (entryPrice - stopLoss)
    } else {
      rr = (entryPrice - takeProfit) / (stopLoss - entryPrice)
    }
  }

  // Handle dummy user for development
  let user = await prisma.user.findFirst()
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@tradetrack.local',
        name: 'Test Trader'
      }
    })
  }

  // Enforce Trading Rules Check
  const rules = await prisma.tradingRules.findUnique({ where: { userId: user.id } })
  if (rules && rules.alertsEnabled) {
    if (rules.maxRiskPerTrade > 0 && riskPercent !== null && riskPercent > rules.maxRiskPerTrade) {
      return { error: `Risk (${riskPercent}%) exceeds your max allowed risk per trade (${rules.maxRiskPerTrade}%)` }
    }
    if (rules.maxTradesPerDay > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tradesToday = await prisma.trade.count({
        where: { userId: user.id, executionDate: { gte: today } }
      })
      if (tradesToday >= rules.maxTradesPerDay) {
        return { error: `Discipline alert: You have reached your max trades per day limit (${rules.maxTradesPerDay})` }
      }
    }
  }

  // Handle Setup Tag
  let setupTagId: string | null = null;
  if (setupTagName && setupTagName !== 'none') {
    let tag = await prisma.setupTag.findFirst({
      where: { userId: user.id, name: setupTagName }
    })
    if (!tag) {
      tag = await prisma.setupTag.create({
        data: { userId: user.id, name: setupTagName }
      })
    }
    setupTagId = tag.id;
  }

  const dataToSave: any = {
    userId: user.id,
    pair,
    direction,
    entryPrice,
    stopLoss,
    takeProfit,
    riskPercent,
    riskAmount,
    lotSize,
    rr: rr && !isNaN(rr) && isFinite(rr) ? parseFloat(rr.toFixed(2)) : null,
    notes,
    setupTagId,
    screenshotUrl
  };

  await prisma.trade.create({
    data: dataToSave
  })
  } catch (err: any) {
    console.error("Failed to save trade:", err);
    return { error: err.message || "Unknown database error" };
  }

  redirect('/history')
}
