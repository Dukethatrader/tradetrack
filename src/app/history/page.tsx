import { getTradesHistory } from '@/app/actions/history'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight, Search } from "lucide-react"

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const { trades, error } = await getTradesHistory()

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          Error loading trade history: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-500 mx-auto max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Trade History
          </h1>
          <p className="text-neutral-400 mt-1">
            Review your past executions and performance.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search pair..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-neutral-200 placeholder:text-neutral-600"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {trades?.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
            No trades recorded yet. Go to Add Trade to record your first execution.
          </div>
        ) : (
          trades?.map((trade) => (
            <Link key={trade.id} href={`/history/${trade.id}`}>
              <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-600 cursor-pointer transition-colors">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    {/* Pair & Direction */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className={`p-3 rounded-xl flex items-center justify-center ${trade.direction === 'BUY' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
                        {trade.direction === 'BUY' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{trade.pair}</span>
                          <Badge variant="outline" className={`border-neutral-700 ${trade.direction === 'BUY' ? 'text-blue-500' : 'text-red-500'}`}>
                            {trade.direction}
                          </Badge>
                        </div>
                        <div className="text-sm text-neutral-500 mt-1">
                          {format(new Date(trade.executionDate), 'MMM d, yyyy • HH:mm')}
                        </div>
                      </div>
                    </div>

                    {/* Trade Details Grid */}
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
                      <div className="space-y-1">
                        <div className="text-xs text-neutral-500 font-medium">Entry</div>
                        <div className="font-mono text-sm">{trade.entryPrice}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-neutral-500 font-medium">Size</div>
                        <div className="font-mono text-sm">{trade.lotSize}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-neutral-500 font-medium">Result</div>
                        <div className={`font-mono text-sm ${trade.pnl && trade.pnl > 0 ? 'text-green-500' : trade.pnl && trade.pnl < 0 ? 'text-red-500' : 'text-neutral-400'}`}>
                          {trade.pnl ? (trade.pnl > 0 ? `+$${trade.pnl}` : `-$${Math.abs(trade.pnl)}`) : '--'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-neutral-500 font-medium">Status</div>
                        <Badge className={
                          trade.status === 'WIN' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' :
                          trade.status === 'LOSS' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' :
                          trade.status === 'BREAKEVEN' ? 'bg-neutral-500/10 text-neutral-400 hover:bg-neutral-500/20' :
                          'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
                        }>
                          {trade.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

