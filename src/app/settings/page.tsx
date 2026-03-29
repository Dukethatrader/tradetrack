import { getSettings, updateSettings } from '@/app/actions/settings'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Settings, ShieldAlert, BellRing, Save } from "lucide-react"

export default async function SettingsPage() {
  const { success, data, error } = await getSettings()

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 mx-auto max-w-2xl pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-2 rounded-xl">
           <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Trading Rules
          </h1>
          <p className="text-sm text-slate-400 mt-1">Configure your discipline constraints and alerts.</p>
        </div>
      </div>

      {!success ? (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          Error loading settings: {error}
        </div>
      ) : (
        <form action={updateSettings as any} className="space-y-6">
          
          <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-700/50">
               <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                 <ShieldAlert className="w-5 h-5 text-emerald-500" /> Risk Management
               </CardTitle>
               <CardDescription className="text-slate-400">Hard stops on your trading frequency to prevent overtrading.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="space-y-2">
                 <label htmlFor="maxTradesPerDay" className="text-sm font-medium text-slate-300">Max Trades Per Day</label>
                 <div className="flex items-center gap-4">
                   <input 
                     type="number" 
                     id="maxTradesPerDay" 
                     name="maxTradesPerDay" 
                     defaultValue={data?.maxTradesPerDay || 0}
                     min="0"
                     className="w-full bg-[#151924] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                   />
                   <span className="text-xs text-slate-500 whitespace-nowrap w-32">0 = Unlimited</span>
                 </div>
               </div>

               <div className="space-y-2">
                 <label htmlFor="maxTradesPerWeek" className="text-sm font-medium text-slate-300">Max Trades Per Week</label>
                 <div className="flex items-center gap-4">
                   <input 
                     type="number" 
                     id="maxTradesPerWeek" 
                     name="maxTradesPerWeek" 
                     defaultValue={data?.maxTradesPerWeek || 0}
                     min="0"
                     className="w-full bg-[#151924] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                   />
                   <span className="text-xs text-slate-500 whitespace-nowrap w-32">0 = Unlimited</span>
                 </div>
               </div>
               
               <div className="space-y-2">
                 <label htmlFor="maxRiskPerTrade" className="text-sm font-medium text-slate-300">Max Risk Per Trade (%)</label>
                 <div className="flex items-center gap-4">
                   <input 
                     type="number" 
                     step="0.1"
                     id="maxRiskPerTrade" 
                     name="maxRiskPerTrade" 
                     defaultValue={data?.maxRiskPerTrade || 0}
                     min="0"
                     className="w-full bg-[#151924] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                   />
                   <span className="text-xs text-slate-500 whitespace-nowrap w-32">e.g. 1.5</span>
                 </div>
               </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C2331] border-transparent rounded-3xl shadow-none">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-700/50">
               <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                 <BellRing className="w-5 h-5 text-blue-500" /> Notifications
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-slate-300">Discipline Alerts</p>
                    <p className="text-xs text-slate-500 mt-1">Warn me when I try to log a trade that breaks my rules.</p>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input 
                      type="checkbox" 
                      name="alertsEnabled" 
                      id="alertsEnabled" 
                      defaultChecked={data?.alertsEnabled ?? true}
                      className="peer sr-only"
                    />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </label>
            </CardContent>
          </Card>

          <div className="pt-4 pb-20">
             <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center">
               <Save className="w-5 h-5 mr-2" />
               Save Setup Rules
             </button>
          </div>

        </form>
      )}
    </div>
  )
}
