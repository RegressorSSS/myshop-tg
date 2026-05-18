import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '../lib/api' // ✅ Добавь импорт

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.products.get(id!) // ✅ Заменили
        if (!res.ok) throw new Error('Товар не найден')
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        console.error(err)
        alert('Ошибка загрузки товара')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  const addToCart = () => {
    if (!product) return
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Товар добавлен в корзину!')
  }

  if (loading) return <div className="container mx-auto p-4">Загрузка...</div>
  if (!product) return <div className="container mx-auto p-4">Товар не найден</div>

  return (
    <div className="container mx-auto p-4 max-w-lg pb-24">
      <div className="relative">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-64 object-contain"
          />
        ) : (
          <div className="bg-gray-200 w-full h-64 flex items-center justify-center">
            <span className="text-gray-500">Нет фото</span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-2">
          {product.is_new && <Badge className="bg-green-500">Новинка</Badge>}
          {product.is_sale && <Badge className="bg-red-500">Распродажа</Badge>}
        </div>
      </div>

      <div className="mt-4">
        <h1 className="text-xl font-bold">{product.name}</h1>
        <p className="text-gray-500">{product.category}</p>
        
        {product.is_sale && product.old_price ? (
          <div className="mt-2">
            <span className="line-through text-gray-500">{product.old_price} ₽</span>
            <span className="ml-2 text-xl font-bold">{product.price} ₽</span>
          </div>
        ) : (
          <p className="text-xl font-bold">{product.price} ₽</p>
        )}

        <div className="mt-4">
          <h3 className="font-semibold">Описание:</h3>
          <p>{product.description || 'Описание отсутствует'}</p>
        </div>

        <div className="mt-6">
          <Button className="w-full" onClick={addToCart}>
            Добавить в корзину
          </Button>
        </div>
      </div>
    </div>
  )
}