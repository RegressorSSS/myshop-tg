import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Order {
  id: number
  created_at: string
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
  items_count: number
}

export default function ProfileOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: fetch('/api/orders')
    setTimeout(() => {
      setOrders([
        { id: 1024, created_at: '2024-04-15T10:00:00Z', total: 24990, status: 'shipped', items_count: 1 },
        { id: 987, created_at: '2024-03-01T14:30:00Z', total: 19990, status: 'delivered', items_count: 2 },
      ])
      setLoading(false)
    }, 500)
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-4 border-b flex items-center gap-3 sticky top-0 z-40">
        <button onClick={() => navigate('/profile')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-lg font-bold">История заказов</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">Заказов пока нет</p>
          <p className="text-gray-400 text-sm mt-1">Сделайте первый заказ в каталоге!</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {orders.map((order) => (
            <Card key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">Заказ #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="capitalize">
                  {order.status === 'pending' && 'В обработке'}
                  {order.status === 'paid' && 'Оплачен'}
                  {order.status === 'shipped' && 'Отправлен'}
                  {order.status === 'delivered' && 'Доставлен'}
                </Badge>
              </div>
              <div className="flex justify-between items-center pt-3 border-t mt-2">
                <p className="text-sm text-gray-600">{order.items_count} товаров</p>
                <p className="font-bold text-lg">{order.total.toLocaleString()} ₽</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}