
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
//import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  // src/pages/ProductDetail.tsx

useEffect(() => {
  if (!id) return
  
  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`)
      if (!res.ok) throw new Error('Product not found')
      
      // ✅ ИСПРАВЛЕННАЯ СТРОКА:
      const data = await res.json()
      
      setProduct(data)
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }
  fetchProduct()
}, [id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-lg mb-4">Товар не найден</p>
        <Button onClick={() => navigate('/')}>← На главную</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="border-b p-4 flex items-center gap-4 sticky top-0 bg-white z-50">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>←</Button>
        <h1 className="text-lg font-medium truncate">{product.name}</h1>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center aspect-square">
            <img 
              src={product.image_url || 'https://placehold.co/600x600/f5f5f5/333?text=No+Image'} 
              alt={product.name} 
              className="max-w-full max-h-full object-contain mix-blend-multiply"
            />
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-500">{product.category}</p>
            </div>
            <div className="text-3xl font-bold">{product.price} ₽</div>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            
            <div className="flex gap-4 pt-4">
              <Button size="lg" className="flex-1" onClick={() => { addToCart(product); navigate('/cart') }}>
                Купить сейчас
              </Button>
              <Button size="lg" variant="outline" onClick={() => addToCart(product)}>
                В корзину
              </Button>
            </div>

            <div className="space-y-2 text-sm text-gray-500 pt-6 border-t">
              <p>✅ Бесплатная доставка от 5000 ₽</p>
              <p>🔄 Возврат в течение 14 дней</p>
              <p>🛡 Гарантия оригинальности</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}