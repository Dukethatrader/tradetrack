'use server'

import prisma from '@/lib/prisma'

export interface DashboardMetrics {
  totalTrades: number;
  winRate: number;
  totalPnl: number;
  profitFactor: number;
}

export async function getDashboardMetrics(): Promise<{ metrics?: DashboardMetrics, error?: string }> {
  try {
    const user = await prisma.user.findFirst()
    
    if (!user) {
      return { 
        metrics: { totalTrades: 0, winRate: 0, totalPnl: 0, profitFactor: 0 } 
      }
    }

    const trades = await prisma.trade.findMany({
      where: { userId: user.id },
      select: {
        status: true,
        pnl: true,
      }
    })

    const totalTrades = trades.length;
    
    if (totalTrades === 0) {
      return { metrics: { totalTrades: 0, winRate: 0, totalPnl: 0, profitFactor: 0 } }
    }

    const winningTrades = trades.filter((t: any) => t.status === 'WIN');
    const losingTrades = trades.filter((t: any) => t.status === 'LOSS');
    
    const winRate = (winningTrades.length / totalTrades) * 100;
    
    const totalPnl = trades.reduce((sum: number, t: any) => sum + (t.pnl || 0), 0);

    const grossProfit = winningTrades.reduce((sum: number, t: any) => sum + (t.pnl || 0), 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum: number, t: any) => sum + (t.pnl || 0), 0));
    
    const profitFactor = grossLoss === 0 ? (grossProfit > 0 ? grossProfit : 0) : grossProfit / grossLoss;

    return {
      metrics: {
        totalTrades,
        winRate,
        totalPnl,
        profitFactor
      }
    }

  } catch (error: any) {
    console.error("Failed to fetch dashboard metrics:", error)
    return { error: error.message || "Unknown database error" }
  }
}
