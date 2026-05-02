import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export default function Cart() {
  const { items, updateQuantity, clearCart, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
        <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
        <Button onClick={() => navigate('/')}>Перейти к покупкам</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-lg font-bold">Корзина ({items.reduce((a, b) => a + b.quantity, 0)})</h1>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>Каталог</Button>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-4">
        {items.map(item => (
          <Card key={item.id} className="flex gap-4 p-4 items-center">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-contain bg-white rounded-md border" />
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="font-bold mt-1">{item.price} ₽</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => updateQuantity(item.id, item.quantity - 1)}>✕</Button>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
              </div>
            </div>
          </Card>
        ))}

        <div className="bg-white p-6 rounded-lg border mt-8">
          <h2 className="text-xl font-bold mb-4">Оформление заказа</h2>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Заказ отправлен!'); clearCart(); }}>
            <div className="space-y-2">
              <Label>Имя</Label>
              <Input placeholder="Ваше имя" required />
            </div>
            <div className="space-y-2">
              <Label>Телефон</Label>
              <Input placeholder="+7 (999) 000-00-00" type="tel" required />
            </div>
            <div className="space-y-2">
              <Label>Адрес доставки</Label>
              <Input placeholder="Город, улица, дом" required />
            </div>
            <div className="pt-4 border-t flex justify-between items-center">
              <span className="text-gray-500">Итого к оплате:</span>
              <span className="text-2xl font-bold">{total} ₽</span>
            </div>
            <Button type="submit" className="w-full" size="lg">Оформить заказ</Button>
          </form>
        </div>
        
        <Button variant="outline" className="w-full mt-4" onClick={clearCart}>Очистить корзину</Button>
      </div>
    </div>
  )
}