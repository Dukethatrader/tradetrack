'use client'

import React, { useState } from 'react'
import { X, Save, Image as ImageIcon } from 'lucide-react'
import { addTrade } from '../actions/trade'

export default function AddTradePage() {
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [riskType, setRiskType] = useState<'PERCENT' | 'AMOUNT'>('PERCENT')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    const formData = new FormData(e.currentTarget)
    formData.append('direction', direction)
    
    // We will pass the file through FormData natively. The server action needs adjusting next.
    const res = await addTrade(formData)
    
    if (res?.error) {
      setErrorMsg(res.error)
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E131F] text-slate-200 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-slate-800/60 bg-[#151924]/80 backdrop-blur-md sticky top-0 z-10">
        <button type="button" className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white" onClick={() => window.history.back()}>
          <X className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold mr-7 text-white tracking-wide">New Trade Execution</h1>
      </header>

      {/* Form Content */}
      <main className="flex-1 p-5 pb-24 overflow-y-auto">
        <form id="addTradeForm" onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 flex items-start space-x-3 backdrop-blur-md">
              <X className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-rose-400">Submission Failed</h3>
                <p className="text-xs text-rose-300/80 mt-1 break-words">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Trading Pair */}
          <div className="space-y-1.5">
            <label htmlFor="pair" className="text-sm font-medium text-slate-400">Trading Pair</label>
            <input 
              type="text" 
              id="pair" 
              name="pair" 
              required
              placeholder="e.g. EUR/USD, AAPL, BTC"
              className="w-full bg-[#151924] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600 transition-all shadow-inner uppercase"
            />
          </div>

          {/* Direction */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-400">Direction</label>
            <div className="flex bg-[#151924] rounded-xl p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setDirection('BUY')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  direction === 'BUY' 
                    ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setDirection('SELL')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  direction === 'SELL' 
                    ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Pricing Inputs */}
          <div className="space-y-5 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="entryPrice" className="text-sm font-medium text-slate-400">Entry Price</label>
              <input type="number" step="any" id="entryPrice" name="entryPrice" required placeholder="0.0000"
                className="w-full bg-[#151924] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600 transition-all shadow-inner" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="stopLoss" className="text-sm font-medium text-slate-400">Stop Loss</label>
              <input type="number" step="any" id="stopLoss" name="stopLoss" required placeholder="0.0000"
                className="w-full bg-[#151924] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600 transition-all shadow-inner" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="takeProfit" className="text-sm font-medium text-slate-400">Take Profit</label>
              <input type="number" step="any" id="takeProfit" name="takeProfit" required placeholder="0.0000"
                className="w-full bg-[#151924] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600 transition-all shadow-inner" />
            </div>
          </div>

          {/* Position Sizing */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="riskValue" className="text-sm font-medium text-slate-400">Risk</label>
                <button 
                  type="button" 
                  onClick={() => setRiskType(riskType === 'PERCENT' ? 'AMOUNT' : 'PERCENT')}
                  className="text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded transition-colors"
                >
                  Use {riskType === 'PERCENT' ? '$' : '%'}
                </button>
              </div>
              <div className="relative">
                <input type="hidden" name="riskType" value={riskType} />
                <input type="number" step="any" id="riskValue" name="riskValue" required placeholder={riskType === 'PERCENT' ? "1.0" : "100.00"}
                  className={`w-full bg-[#151924] border border-slate-800 rounded-xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600 transition-all shadow-inner ${riskType === 'PERCENT' ? 'pl-4 pr-10' : 'pl-8 pr-4'}`} />
                {riskType === 'PERCENT' ? (
                  <span className="absolute right-4 top-3.5 text-slate-500 pointer-events-none">%</span>
                ) : (
                  <span className="absolute left-4 top-3.5 text-slate-500 pointer-events-none">$</span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lotSize" className="text-sm font-medium text-slate-400">Lot Size</label>
              <input type="number" step="0.01" id="lotSize" name="lotSize" required placeholder="0.10"
                className="w-full bg-[#151924] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600 transition-all shadow-inner" />
            </div>
          </div>

          {/* Setup Tag */}
          <div className="space-y-1.5 pt-2">
            <label htmlFor="setupTag" className="text-sm font-medium text-slate-400">Trade Setup Tag</label>
            <div className="relative">
              <select 
                id="setupTag" 
                name="setupTag"
                className="w-full bg-[#151924] border border-slate-800 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                defaultValue="Trend Breakout"
              >
                <option value="none">No Tag</option>
                <option value="Trend Breakout">Trend Breakout</option>
                <option value="Mean Reversion">Mean Reversion</option>
                <option value="Liquidity Sweep">Liquidity Sweep</option>
                <option value="Supply/Demand">Supply/Demand</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5 pt-2">
            <label htmlFor="notes" className="text-sm font-medium text-slate-400">Trade Notes</label>
            <textarea 
              id="notes" 
              name="notes" 
              rows={4} 
              placeholder="Describe your logic, feelings, and the current market context..."
              className="w-full bg-[#151924] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600 resize-none transition-all shadow-inner" 
            />
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-medium text-slate-400">Upload Screenshot</label>
            <label 
              htmlFor="screenshot"
              className={`border-2 border-dashed rounded-xl p-8 bg-[#151924]/50 flex flex-col items-center justify-center hover:bg-[#151924] transition-all cursor-pointer group overflow-hidden relative ${previewUrl ? 'border-blue-500/50 min-h-[200px] p-2' : 'border-slate-700/60 hover:border-blue-500/50'}`}
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Chart Preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <>
                  <div className="bg-slate-800/80 p-3 rounded-full mb-3 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                    <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                  </div>
                  <p className="text-sm text-slate-300 mb-1">Click or drag image to upload chart</p>
                  <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                </>
              )}
              <input 
                type="file" 
                name="screenshot" 
                id="screenshot" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

        </form>
      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0E131F] via-[#0E131F] to-transparent pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button 
            type="submit" 
            form="addTradeForm" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save Trade Execution
          </button>
        </div>
      </div>
    </div>
  )
}
