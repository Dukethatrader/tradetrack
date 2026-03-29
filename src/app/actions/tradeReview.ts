'use server'

import prisma from '@/lib/prisma'

export async function getTradeById(id: string) {
  try {
    const trade = await prisma.trade.findUnique({
      where: {
        id: id
      },
      include: {
        setupTag: true,
        mistakes: {
          include: {
            mistake: true
          }
        }
      }
    })

    return { trade }
  } catch (error: any) {
    console.error("Failed to fetch trade:", error)
    return { error: error.message || "Unknown database error" }
  }
}
