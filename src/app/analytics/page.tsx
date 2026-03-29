import { getAnalyticsData } from '@/app/actions/analytics'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, AlertCircle, TrendingUp, Tag } from "lucide-react"

export default async function AnalyticsPage() {
  const { success, data, error } = await getAnalyticsData()

  if (!success || error) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          Error loading analytics: {error || "Failed to fetch data"}
        </div>
      </div>
    )
  }

  const { setupPerformance, topMistakes } = data || { setupPerformance: [], topMistakes: [] }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 mx-auto max-w-4xl pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-2 rounded-xl">
           <BarChart2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Performance Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">Deep dive into your strategies and psychology.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strategy Performance */}
        <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none h-full">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-700/50">
             <CardTitle className="text-base font-bold text-white flex items-center gap-2">
               <Tag className="w-4 h-4 text-purple-400" /> Setup Win Rates
             </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
             {setupPerformance.length === 0 ? (
                <div className="text-center text-slate-500 py-8 italic text-sm">
                  Tag trades with setups to generate analytics.
                </div>
             ) : (
                <div className="space-y-6">
                  {setupPerformance.map((setup: any, idx: number) => (
                     <div key={idx}>
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-sm font-medium text-slate-200">{setup.tag}</span>
                         <span className="text-sm font-bold text-white">{setup.winRate}%</span>
                       </div>
                       <div className="w-full bg-[#141A25] rounded-full h-2.5">
                         <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${setup.winRate}%` }}></div>
                       </div>
                       <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
                         <span>{setup.total} Trades</span>
                         <span className="text-emerald-500">{setup.wins}W</span>
                       </div>
                     </div>
                  ))}
                </div>
             )}
          </CardContent>
        </Card>

        {/* Psychological Mistakes */}
        <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none h-full">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-700/50">
             <CardTitle className="text-base font-bold text-white flex items-center gap-2">
               <AlertCircle className="w-4 h-4 text-red-500" /> Top Trading Mistakes
             </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
             {topMistakes.length === 0 ? (
                <div className="text-center text-slate-500 py-8 italic text-sm">
                  No mistakes recorded. Keep up the discipline!
                </div>
             ) : (
                <div className="space-y-5">
                  {topMistakes.slice(0, 5).map((mistake: any, idx: number) => (
                     <div key={idx} className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                       <div className="flex items-center gap-3">
                         <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs font-bold text-slate-400">
                           {idx + 1}
                         </span>
                         <span className="text-sm font-medium text-slate-200">{mistake.name}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="text-xs text-slate-500">Frequency</span>
                         <div className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg text-sm font-bold">
                           {mistake.count}x
                         </div>
                       </div>
                     </div>
                  ))}
                </div>
             )}
          </CardContent>
        </Card>
      </div>
      
      {/* Return Metrics Placeholder */}
      <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none">
        <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-700/50">
           <CardTitle className="text-base font-bold text-white flex items-center gap-2">
             <TrendingUp className="w-4 h-4 text-emerald-500" /> Expected Values
           </CardTitle>
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center">
           <p className="text-slate-500 text-sm">
             Advanced metrics & expectancies coming soon...
           </p>
        </CardContent>
      </Card>

    </div>
  )
}
