'use server'

import prisma from '@/lib/prisma'

export async function getAnalyticsData() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return { success: false, data: null };

    const trades = await prisma.trade.findMany({
      where: { userId: user.id },
      include: {
        setupTag: true,
        mistakes: { include: { mistake: true } }
      },
      orderBy: { executionDate: 'asc' }
    });

    // Strategy / Setup Win Rate
    const setupsMap = new Map();
    // Mistakes frequency
    const mistakesMap = new Map();

    trades.forEach(trade => {
      // Setups
      if (trade.setupTag) {
        const name = trade.setupTag.name;
        if (!setupsMap.has(name)) {
          setupsMap.set(name, { tag: name, total: 0, wins: 0, losses: 0 });
        }
        const stats = setupsMap.get(name);
        stats.total += 1;
        if (trade.status === 'WIN') stats.wins += 1;
        if (trade.status === 'LOSS') stats.losses += 1;
      }
      
      // Mistakes
      if (trade.mistakes && trade.mistakes.length > 0) {
         trade.mistakes.forEach((tm: any) => {
            const mName = tm.mistake.name;
            if (!mistakesMap.has(mName)) {
               mistakesMap.set(mName, { name: mName, count: 0 });
            }
            mistakesMap.get(mName).count += 1;
         });
      }
    });

    const setupPerformance = Array.from(setupsMap.values()).map(s => ({
      ...s,
      winRate: s.total > 0 ? ((s.wins / s.total) * 100).toFixed(1) : '0.0'
    }));

    const topMistakes = Array.from(mistakesMap.values())
                           .sort((a, b) => b.count - a.count);

    return {
      success: true,
      data: {
        setupPerformance,
        topMistakes
      }
    }

  } catch (error: any) {
    console.error("Failed to fetch analytics:", error);
    return { success: false, error: error.message };
  }
}
