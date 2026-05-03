import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ShoppingBag, ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

const tabs = [
  { path: '/', label: 'Каталог', icon: ShoppingBag },
  { path: '/cart', label: 'Корзина', icon: ShoppingCart },
  { path: '/profile', label: 'Профиль', icon: User },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { items } = useCart()
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 pb-4 pt-2 z-50 safe-area-pb">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          const Icon = tab.icon
          
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative',
                isActive ? 'text-black scale-105' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {tab.path === '/cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}