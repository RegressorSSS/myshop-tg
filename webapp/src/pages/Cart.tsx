import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '../lib/api' // ✅ Добавь импорт

// Объявляем тип для window.Telegram
declare global {
  interface Window {
    Telegram?: any
  }
}

export default function Cart() {
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setItems(cart)
    calculateTotal(cart)
    setLoading(false)
  }, [])

  const calculateTotal = (cart: any[]) => {
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    setTotal(sum)
  }

  const removeFromCart = (productId: number) => {
    const updatedCart = items.filter(item => item.id !== productId)
    setItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    calculateTotal(updatedCart)
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Корзина пуста!')
      return
    }

    const initData = window.Telegram?.WebApp?.initData || ''

    try {
      const res = await api.orders.create({ // ✅ Заменили
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: total
      }, initData) // передаём initData

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || 'Ошибка оформления заказа')
      }

      alert('Заказ успешно оформлен!')
      localStorage.removeItem('cart')
      setItems([])
      setTotal(0)
    } catch (err: any) {
      console.error(err)
      alert('Ошибка: ' + err.message)
    }
  }

  if (loading) return <div className="container mx-auto p-4">Загрузка...</div>

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-xl font-bold mb-4">🛒 Ваша корзина пуста</h2>
        <p>Добавьте товары в корзину, чтобы оформить заказ.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-lg pb-24">
      <h2 className="text-xl font-bold mb-4">🛒 Корзина</h2>
      
      <div className="space-y-4">
        {items.map(item => (
          <Card key={item.id}>
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <Badge variant="secondary">{item.quantity} шт.</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex justify-between items-center">
                <span className="font-bold">{item.price * item.quantity} ₽</span>
                <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Итого: {total} ₽</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" onClick={handleCheckout}>
            Оформить заказ
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}