import { getDashboardMetrics } from '@/app/actions/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Target, DollarSign, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const { metrics, error } = await getDashboardMetrics()

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          Error loading dashboard metrics: {error}
        </div>
      </div>
    )
  }

  // Format numbers safely
  const formattedWinRate = metrics?.winRate ? metrics.winRate.toFixed(1) : "0.0";
  const formattedPnl = metrics?.totalPnl ? (metrics.totalPnl > 0 ? `+$${metrics.totalPnl.toFixed(2)}` : `-$${Math.abs(metrics.totalPnl).toFixed(2)}`) : "$0.00";
  const formattedProfitFactor = metrics?.profitFactor ? metrics.profitFactor.toFixed(2) : "0.00";

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-500 mx-auto max-w-4xl">
      
      {/* Header Container */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
             <Activity className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Dashboard
          </h1>
        </div>
        {/* Placeholder for Search and Notification Icons from design */}
        <div className="flex items-center gap-4 text-neutral-400">
          <Activity className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          <Target className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Top Metrics Grid (2x2 as in image) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Win Rate Card */}
        <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none">
          <CardContent className="p-5 md:p-6">
            <p className="text-sm font-medium text-slate-400 mb-2">Win Rate</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl md:text-4xl font-bold text-white">{formattedWinRate}%</span>
              {/* Optional secondary metric chip */}
              <span className="bg-emerald-500/10 text-emerald-500 text-xs font-semibold px-2 py-1 rounded-full mb-1">+2.4%</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Trades Card */}
        <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none">
          <CardContent className="p-5 md:p-6">
            <p className="text-sm font-medium text-slate-400 mb-2">Total Trades</p>
            <div className="text-3xl md:text-4xl font-bold text-blue-500">
              {metrics?.totalTrades || 0}
            </div>
          </CardContent>
        </Card>

        {/* Net PnL Card */}
        <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none">
          <CardContent className="p-5 md:p-6">
            <p className="text-sm font-medium text-slate-400 mb-2">Net PnL</p>
            <div className={`text-3xl md:text-4xl font-bold ${metrics?.totalPnl && metrics.totalPnl > 0 ? 'text-emerald-500' : metrics?.totalPnl && metrics.totalPnl < 0 ? 'text-red-500' : 'text-slate-300'}`}>
              {formattedPnl}
            </div>
          </CardContent>
        </Card>

        {/* Profit Factor Card / Avg R/R */}
        <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none">
          <CardContent className="p-5 md:p-6">
            <p className="text-sm font-medium text-slate-400 mb-2">Profit Factor</p>
            <div className="text-3xl md:text-4xl font-bold text-white">
              {formattedProfitFactor}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equity Curve Placeholder */}
      <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none overflow-hidden">
        <CardHeader className="pb-0 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white">Equity Curve</CardTitle>
              <p className="text-sm text-slate-400 mt-1">Portfolio growth over time</p>
            </div>
            <div className="bg-[#141A25] px-4 py-2 rounded-xl text-sm text-slate-300 cursor-pointer">
              All Time
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-64 flex flex-col items-center justify-center mt-4">
           {/* Mockup Line Graph Shape */}
           <div className="w-full flex-1 border-b border-l border-slate-700/50 flex items-end justify-between pb-2 px-2 gap-1 opacity-50 relative">
             <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />
             <p className="text-slate-500 text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               Chart integration coming soon...
             </p>
           </div>
        </CardContent>
      </Card>
      
      {/* Bottom Layout Blocks matching mockup: Trades Per Day & Wins vs Losses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Trades Taken Per Day */}
        <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none">
          <CardHeader className="px-6 pt-6 pb-4">
             <CardTitle className="text-base font-bold text-white">Trades Taken Per Day</CardTitle>
          </CardHeader>
          <CardContent className="h-48 flex items-end justify-between px-8 pb-6 gap-2 opacity-50">
            <div className="w-full bg-blue-500 rounded-t-lg h-1/4" />
            <div className="w-full bg-blue-500 rounded-t-lg h-3/5" />
            <div className="w-full bg-blue-500 rounded-t-lg h-1/3" />
            <div className="w-full bg-blue-500 rounded-t-lg h-4/5" />
            <div className="w-full bg-blue-500 rounded-t-lg h-1/6" />
          </CardContent>
        </Card>

        {/* Wins vs Losses Donut */}
        <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none">
          <CardHeader className="px-6 pt-6 pb-2 text-center">
             <CardTitle className="text-base font-bold text-white">Wins vs Losses</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
             <div className="w-32 h-32 rounded-full border-8 border-blue-600 flex items-center justify-center border-l-slate-700 border-b-slate-700 relative mb-6">
                <span className="text-2xl font-bold text-white">{formattedWinRate}%</span>
             </div>
             <div className="w-full flex justify-between items-center text-sm font-medium">
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /> <span className="text-slate-300">Wins</span></div>
               <span className="text-white font-bold">{metrics?.totalTrades ? Math.floor(metrics.totalTrades * (metrics.winRate / 100)) : 0}</span>
             </div>
             <div className="w-full flex justify-between items-center text-sm font-medium mt-3">
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-500" /> <span className="text-slate-300">Losses</span></div>
               <span className="text-white font-bold">{metrics?.totalTrades ? metrics.totalTrades - Math.floor(metrics.totalTrades * (metrics.winRate / 100)) : 0}</span>
             </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
