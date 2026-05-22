import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { api } from '../lib/api'

declare global {
  interface Window {
    Telegram?: any
  }
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image_url?: string
  category?: string
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [comment, setComment] = useState('')

  const user = window.Telegram?.WebApp?.initDataUnsafe?.user

  useEffect(() => {
    if (user && !fullName) {
      setFullName(`${user.first_name || ''} ${user.last_name || ''}`.trim())
    }
  }, [user])

  const loadCart = () => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('myshop_cart') || '[]')
    setItems(cart)
    const sum = cart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0)
    setTotal(sum)
    setLoading(false)
  }

  useEffect(() => {
    loadCart()
    const handleCartUpdate = () => loadCart()
    window.addEventListener('storage', handleCartUpdate)
    window.addEventListener('cart-updated', handleCartUpdate)
    return () => {
      window.removeEventListener('storage', handleCartUpdate)
      window.removeEventListener('cart-updated', handleCartUpdate)
    }
  }, [])

  const updateCart = (newCart: CartItem[]) => {
    setItems(newCart)
    localStorage.setItem('myshop_cart', JSON.stringify(newCart))
    const sum = newCart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0)
    setTotal(sum)
    window.dispatchEvent(new CustomEvent('cart-updated'))
  }

  const increaseQuantity = (id: number) => {
    const newCart = items.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    )
    updateCart(newCart)
  }

  const decreaseQuantity = (id: number) => {
    const item = items.find(i => i.id === id)
    if (item && item.quantity === 1) {
      removeFromCart(id)
    } else {
      const newCart = items.map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      updateCart(newCart)
    }
  }

  const removeFromCart = (id: number) => {
    const newCart = items.filter(item => item.id !== id)
    updateCart(newCart)
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      alert('Введите ФИО')
      return
    }
    if (!phone.trim()) {
      alert('Введите номер телефона')
      return
    }
    if (!address.trim()) {
      alert('Введите адрес доставки')
      return
    }

    const initData = window.Telegram?.WebApp?.initData || ''
    const orderData = {
      user_id: user?.id || 0,
      user_name: fullName.trim(),
      username: user?.username || '',
      phone: phone.trim(),
      address: address.trim(),
      comment: comment.trim(),
      items: items.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total
    }

    try {
      const res = await api.orders.create(orderData, initData)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Ошибка оформления заказа')
      }
      alert('Заказ успешно оформлен! С вами свяжутся .')
      localStorage.removeItem('myshop_cart')
      setItems([])
      setTotal(0)
      window.dispatchEvent(new CustomEvent('cart-updated'))
      setShowForm(false)
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

  if (showForm) {
    const isFormValid = fullName.trim() !== '' && phone.trim() !== '' && address.trim() !== '';
    return (
      <div className="container mx-auto p-4 max-w-lg pb-24">
        <h2 className="text-xl font-bold mb-4">📋 Оформление заказа</h2>
        <form onSubmit={handleSubmitOrder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ФИО *</label>
            <Input 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              required 
              placeholder="Введите ваше ФИО"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Телефон *</label>
            <Input 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="+7 123 456-78-90" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Адрес доставки *</label>
            <Input 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              placeholder="Город, улица, дом, квартира" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Комментарий</label>
            <Textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} />
          </div>
          <div className="text-lg font-bold">Итого: {total} ₽</div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Назад</Button>
            <Button type="submit" disabled={!isFormValid}>
              Подтвердить заказ
            </Button>
          </div>
          {!isFormValid && (
            <p className="text-red-500 text-sm text-center">Заполните все обязательные поля (ФИО, телефон, адрес)</p>
          )}
        </form>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-lg pb-24">
      <h2 className="text-xl font-bold mb-4">🛒 Корзина</h2>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="border rounded-lg p-4 flex gap-3">
            {item.image_url && (
              <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-base">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => decreaseQuantity(item.id)} className="w-7 h-7 border rounded">-</button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)} className="w-7 h-7 border rounded">+</button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold">{item.price * item.quantity} ₽</span>
                <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>Удалить</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border rounded-lg">
        <div className="text-lg font-bold">Итого: {total} ₽</div>
        <Button className="w-full mt-4" onClick={() => setShowForm(true)}>Оформить заказ</Button>
      </div>
    </div>
  )
}