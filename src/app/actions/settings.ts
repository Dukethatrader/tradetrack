'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
  try {
    const user = await prisma.user.findFirst()
    if (!user) return { success: false, data: null, error: "User not found" }

    let rules = await prisma.tradingRules.findUnique({
      where: { userId: user.id }
    })

    if (!rules) {
      rules = await prisma.tradingRules.create({
        data: { userId: user.id }
      })
    }

    return { success: true, data: rules }
  } catch (err: any) {
    console.error("Failed to get settings:", err)
    return { success: false, error: err.message || "Database error" }
  }
}

export async function updateSettings(formData: FormData) {
  try {
    const user = await prisma.user.findFirst()
    if (!user) return { success: false, error: "User not found" }

    const maxTradesPerDay = parseInt(formData.get('maxTradesPerDay') as string) || 0
    const maxTradesPerWeek = parseInt(formData.get('maxTradesPerWeek') as string) || 0
    const maxRiskPerTrade = parseFloat(formData.get('maxRiskPerTrade') as string) || 0
    const alertsEnabled = formData.get('alertsEnabled') === 'on'

    const rules = await prisma.tradingRules.upsert({
      where: { userId: user.id },
      update: {
        maxTradesPerDay,
        maxTradesPerWeek,
        maxRiskPerTrade,
        alertsEnabled
      },
      create: {
        userId: user.id,
        maxTradesPerDay,
        maxTradesPerWeek,
        maxRiskPerTrade,
        alertsEnabled
      }
    })

    revalidatePath('/settings')
    return { success: true, data: rules }
  } catch (err: any) {
    console.error("Failed to update settings:", err)
    return { success: false, error: err.message || "Database error" }
  }
}
