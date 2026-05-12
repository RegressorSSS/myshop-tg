import { useEffect, useState } from 'react'
import  WebApp  from '@twa-dev/sdk'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate, Link } from 'react-router-dom' // <-- Добавил Link
import { ChevronRight, Package, Gift, Settings, HelpCircle, Shield } from 'lucide-react' // <-- Добавил Shield

export default function Profile() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('Пользователь')
  const [userInitial, setUserInitial] = useState('U')

  useEffect(() => {
    // Безопасное получение данных из Telegram
    try {
      if (WebApp && WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
        const user = WebApp.initDataUnsafe.user
        setUserName(user.first_name || 'Пользователь')
        setUserInitial(user.first_name?.[0]?.toUpperCase() || 'U')
      }
    } catch (err) {
      console.error('Error loading user:', err)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Шапка */}
      <div className="bg-white p-6 text-center border-b">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {userInitial}
        </div>
        <h1 className="text-xl font-bold">{userName}</h1>
      </div>

      {/* Бонусы */}
      <div className="p-4">
        <Card className="p-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white border-0 shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-300 text-sm">Ваши бонусы</p>
              <p className="text-3xl font-bold">0 ₽</p>
            </div>
            <Gift className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Меню */}
      <div className="px-4 mt-4 space-y-2">
        
        {/* Кнопка Админки (видна всем, но работать будет только если ты админ по ID в .env) */}
        <Link to="/admin/create-product">
          <Button variant="outline" className="w-full justify-start gap-3 h-12 text-base border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700">
            <Shield className="w-5 h-5" /> Админка: Добавить товар
          </Button>
        </Link>

        <div className="border-t my-2"></div>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-12 text-base" 
          onClick={() => navigate('/profile/orders')}
        >
          <Package className="w-5 h-5 text-gray-500" /> История заказов
          <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
        </Button>
        
        <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base">
          <Gift className="w-5 h-5 text-gray-500" /> Промокоды
          <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
        </Button>
        
        <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base">
          <Settings className="w-5 h-5 text-gray-500" /> Настройки
          <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
        </Button>
        
        <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base">
          <HelpCircle className="w-5 h-5 text-gray-500" /> Помощь
          <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
        </Button>
      </div>
    </div>
  )
}