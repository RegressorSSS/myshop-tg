// src/pages/Cart.tsx
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { WebApp } from '@twa-dev/sdk'

export default function Cart() {
  const navigate = useNavigate()
  // Берём данные и функции из ГЛОБАЛЬНОГО контекста
  const { items, updateQuantity, total, count } = useCart()

  const handleCheckout = () => {
    if (WebApp.HapticFeedback) WebApp.HapticFeedback.notificationOccurred('success')
    // TODO: Здесь будет отправка заказа на бэкенд
    alert('Оформление заказа подключим на следующем шаге!')
  }

  // Если корзина пуста
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 pb-24">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">Корзина пуста</h2>
        <p className="text-gray-500 text-center mb-6">Добавьте товары из каталога</p>
        <Button onClick={() => navigate('/')}>Перейти в каталог</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Шапка */}
      <header className="bg-white border-b p-4 flex items-center justify-center sticky top-0 z-50">
        <h1 className="text-lg font-bold">Корзина ({count})</h1>
      </header>

      {/* Список товаров */}
      <div className="p-4 space-y-4">
        {items.map(item => (
          <Card key={item.id} className="p-4 flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              <img
                src={item.image_url || 'https://placehold.co/200x200/f5f5f5/333?text=No+Image'}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-medium line-clamp-1">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.price.toLocaleString()} ₽</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                {/* Кнопки количества */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="font-bold">{(item.price * item.quantity).toLocaleString()} ₽</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Фиксированный футер с итогом */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t p-4 shadow-lg z-40">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">Итого:</span>
          <span className="text-2xl font-bold">{total.toLocaleString()} ₽</span>
        </div>
        <Button className="w-full h-12 text-lg" onClick={handleCheckout}>
          Оформить заказ
        </Button>
      </div>
    </div>
  )
}