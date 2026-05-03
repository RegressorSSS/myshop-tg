// src/pages/Home.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Базовый URL для API (меняется в зависимости от окружения)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export default function Home() {
  const navigate = useNavigate()
  const { addToCart, updateQuantity, getQuantity } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addedProductId, setAddedProductId] = useState<number | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`)
        if (!res.ok) throw new Error('Failed to fetch products')
        
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Не удалось загрузить товары. Проверьте, запущен ли бэкенд.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    // Анимация: показываем, что товар добавлен
    setAddedProductId(product.id)
    setTimeout(() => setAddedProductId(null), 800)
  }

  const handleIncrement = (productId: number) => {
    const quantity = getQuantity(productId)
    updateQuantity(productId, quantity + 1)
  }

  const handleDecrement = (productId: number) => {
    const quantity = getQuantity(productId)
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1)
    } else {
      updateQuantity(productId, 0) // Удалит товар
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка товаров...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-center">
          <h1 className="text-lg font-bold tracking-tight">⚽ MYSHOP</h1>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gray-50 py-12 px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">Новая коллекция 2024</h2>
        <p className="text-gray-500 mb-6">Профессиональная экипировка для побед</p>
        <Button onClick={() => {
          const el = document.getElementById('products')
          el?.scrollIntoView({ behavior: 'smooth' })
        }}>
          Смотреть каталог
        </Button>
      </section>

      {/* Products Grid */}
      <main id="products" className="container mx-auto px-4 py-10 pb-24">
        {products.length === 0 ? (
          <p className="text-center text-gray-500">Товаров пока нет. Добавьте их через админку или API.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => {
              const quantity = getQuantity(p.id)
              const isInCart = quantity > 0
              const isAnimating = addedProductId === p.id

              return (
                <Card 
                  key={p.id} 
                  className={cn(
                    "group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-200",
                    isAnimating && "scale-95 shadow-md"
                  )}
                >
                  <CardHeader className="p-0">
                    <div 
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="relative aspect-square bg-gray-100 overflow-hidden"
                    >
                      <img 
                        src={p.image_url || 'https://placehold.co/600x600/f5f5f5/333?text=No+Image'} 
                        alt={p.name} 
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {p.is_new && <Badge className="absolute top-2 left-2 bg-black text-white">New</Badge>}
                      {p.original_price && p.original_price > p.price && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white">Sale</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{p.category}</p>
                    <h4 className="font-medium leading-tight mb-2 line-clamp-2">{p.name}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold">{p.price.toLocaleString()} ₽</span>
                      {p.original_price && p.original_price > p.price && (
                        <span className="text-sm text-gray-400 line-through">{p.original_price.toLocaleString()} ₽</span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    {isInCart ? (
                      // Показываем + / - если товар в корзине
                      <div className="flex items-center gap-2 w-full">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 shrink-0 hover:bg-gray-100"
                          onClick={(e) => { 
                            e.stopPropagation()
                            handleDecrement(p.id)
                          }}
                        >
                          −
                        </Button>
                        <span className="flex-1 text-center font-semibold text-lg">
                          {quantity}
                        </span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 shrink-0 hover:bg-gray-100"
                          onClick={(e) => { 
                            e.stopPropagation()
                            handleIncrement(p.id)
                          }}
                        >
                          +
                        </Button>
                      </div>
                    ) : (
                      // Показываем "В корзину" если товара нет
                      <Button 
                        className={cn(
                          "w-full transition-all duration-200",
                          isAnimating && "bg-green-600 hover:bg-green-700"
                        )}
                        onClick={(e) => { 
                          e.stopPropagation()
                          handleAddToCart(p)
                        }}
                      >
                        В корзину
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}