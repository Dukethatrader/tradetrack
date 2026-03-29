import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0E131F] text-slate-200 flex flex-col items-center justify-center p-8 text-center font-sans tracking-wide">
      <h1 className="text-3xl font-bold text-white mb-4">TradeTrack Dashboard</h1>
      <p className="text-slate-400 mb-8 max-w-md">The Trading Journal Web App is currently under construction. Proceed to the "Add Trade" execution form to log a new trade.</p>
      
      <Link href="/add-trade" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
        Go to Add Trade Page
      </Link>
    </div>
  )
}
