'use server'

import prisma from '@/lib/prisma'

export async function getTradesHistory(): Promise<{ trades?: any[], error?: string }> {
  try {
    // For now we'll fetch the first user as we don't have auth yet
    const user = await prisma.user.findFirst()
    
    if (!user) {
      return { trades: [] }
    }

    const trades = await prisma.trade.findMany({
      where: {
        userId: user.id
      },
      include: {
        setupTag: true,
        mistakes: {
          include: {
            mistake: true
          }
        }
      },
      orderBy: {
        executionDate: 'desc'
      }
    })

    return { trades }
  } catch (error: any) {
    console.error("Failed to fetch trades:", error)
    return { error: error.message || "Unknown database error" }
  }
}
