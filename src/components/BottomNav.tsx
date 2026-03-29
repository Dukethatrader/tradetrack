'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, BarChart2, Settings, PlusCircle } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { name: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard },
    { name: 'HISTORY', href: '/history', icon: BookOpen },
    { name: 'ADD TRADE', href: '/add-trade', icon: PlusCircle, isMain: true },
    { name: 'ANALYTICS', href: '/analytics', icon: BarChart2 },
    { name: 'SETTINGS', href: '/settings', icon: Settings },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#141A25] border-t border-[#1C2331] pb-safe">
      <nav className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          if (item.isMain) {
             return (
               <Link 
                 key={item.name} 
                 href={item.href}
                 className="flex flex-col items-center justify-center -mt-6"
               >
                 <div className="bg-blue-600 rounded-full p-3 shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-colors">
                   <Icon className="w-6 h-6 text-white" />
                 </div>
                 <span className="text-[10px] font-bold mt-1 text-slate-400">ADD</span>
               </Link>
             )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold leading-none">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
