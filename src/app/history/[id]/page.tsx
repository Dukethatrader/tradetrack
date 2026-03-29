import { getTradeById } from '@/app/actions/tradeReview'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Tag, BookX, Calendar } from "lucide-react"

export default async function TradeReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { trade, error } = await getTradeById(id)

  if (error || !trade) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <Link href="/history" className="text-slate-400 hover:text-white flex items-center gap-2 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          {error || "Trade not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 mx-auto max-w-4xl">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/history" className="text-slate-400 hover:text-white flex items-center gap-2 w-fit transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl flex items-center justify-center ${trade.direction === 'BUY' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
              {trade.direction === 'BUY' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                {trade.pair}
              </h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(trade.executionDate), 'MMM d, yyyy HH:mm')}</span>
                {trade.setupTag && (
                  <span className="flex items-center gap-1 text-purple-400"><Tag className="w-3 h-3" /> {trade.setupTag.name}</span>
                )}
              </div>
            </div>
          </div>
          <Badge className={`text-base px-4 py-1.5 ${
            trade.status === 'WIN' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' :
            trade.status === 'LOSS' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' :
            trade.status === 'BREAKEVEN' ? 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20' :
            'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
          }`}>
            {trade.status}
          </Badge>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#1C2331] border-transparent rounded-2xl shadow-none">
          <CardContent className="p-4 sm:p-5">
            <p className="text-xs font-medium text-slate-400 mb-1">Entry Price</p>
            <div className="font-mono text-lg text-white">{trade.entryPrice}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C2331] border-transparent rounded-2xl shadow-none">
          <CardContent className="p-4 sm:p-5">
            <p className="text-xs font-medium text-slate-400 mb-1">Stop Loss</p>
            <div className="font-mono text-lg text-white">{trade.stopLoss}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C2331] border-transparent rounded-2xl shadow-none">
          <CardContent className="p-4 sm:p-5">
            <p className="text-xs font-medium text-slate-400 mb-1">Take Profit</p>
            <div className="font-mono text-lg text-white">{trade.takeProfit}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C2331] border-transparent rounded-2xl shadow-none">
          <CardContent className="p-4 sm:p-5">
            <p className="text-xs font-medium text-slate-400 mb-1">Lot Size</p>
            <div className="font-mono text-lg text-white">{trade.lotSize}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1C2331] border-transparent rounded-2xl shadow-none">
          <CardContent className="p-4 sm:p-5">
            <p className="text-xs font-medium text-slate-400 mb-1">Risk Amount</p>
            <div className="font-mono text-lg text-white">{trade.riskAmount ? `$${trade.riskAmount}` : '-'}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C2331] border-transparent rounded-2xl shadow-none">
          <CardContent className="p-4 sm:p-5">
            <p className="text-xs font-medium text-slate-400 mb-1">Risk/Reward</p>
            <div className="font-mono text-lg text-white">{trade.rr ? `1:${trade.rr.toFixed(2)}` : '-'}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C2331] border-transparent rounded-2xl shadow-none md:col-span-2">
          <CardContent className="p-4 sm:p-5">
            <p className="text-xs font-medium text-slate-400 mb-1">Net PnL</p>
            <div className={`font-mono text-xl font-bold ${trade.pnl && trade.pnl > 0 ? 'text-emerald-500' : trade.pnl && trade.pnl < 0 ? 'text-red-500' : 'text-slate-300'}`}>
              {trade.pnl ? (trade.pnl > 0 ? `+$${trade.pnl}` : `-$${Math.abs(trade.pnl)}`) : 'Pending'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Notes & Reflection */}
        <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none h-full">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Trade Notes</h3>
            {trade.notes ? (
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{trade.notes}</p>
            ) : (
              <p className="text-slate-500 italic">No notes recorded for this trade.</p>
            )}
            
            {(trade.reflection || trade.status !== 'OPEN') && (
               <div className="mt-8">
                 <h3 className="text-lg font-bold text-white mb-4">Post-Trade Reflection</h3>
                 {trade.reflection ? (
                   <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{trade.reflection}</p>
                 ) : (
                   <div className="bg-[#141A25] p-4 rounded-xl border border-dashed border-slate-700 text-center">
                     <p className="text-sm text-slate-400 mb-3">Add a reflection to complete your review process.</p>
                     <button className="text-sm bg-blue-600 hover:bg-blue-500 text-white py-1.5 px-4 rounded-lg transition-colors">
                       Add Reflection
                     </button>
                   </div>
                 )}
               </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Mistakes */}
          <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BookX className="w-5 h-5 text-red-400" /> Mistakes Tagged
              </h3>
              {trade.mistakes && trade.mistakes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {trade.mistakes.map((m: any) => (
                    <Badge key={m.mistakeId} variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1">
                      {m.mistake.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No discipline mistakes recorded. Flawless execution!</p>
              )}
            </CardContent>
          </Card>
          
          {/* Screenshot Placeholder */}
          <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none">
            <CardContent className="p-6">
               <h3 className="text-lg font-bold text-white mb-4">Chart Screenshot</h3>
               {trade.screenshotUrl ? (
                 <div className="rounded-xl overflow-hidden border border-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={trade.screenshotUrl} alt="Trade chart setup" className="w-full h-auto object-cover" />
                 </div>
               ) : (
                 <div className="bg-[#141A25] h-40 rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
                   <p className="text-sm">No screenshot attached</p>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
      
    </div>
  )
}
