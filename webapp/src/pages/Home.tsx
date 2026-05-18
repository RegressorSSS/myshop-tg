import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { api } from '../lib/api' // ✅ Добавь импорт

export default function Home() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadProducts()
  }, [search, selectedCategory])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory)

      const res = await api.products.list(params) // ✅ Заменили
      if (!res.ok) throw new Error('Ошибка загрузки товаров')
      const data = await res.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error(err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: any) => {
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

  const categories = ['all', 'Бутсы', 'Мячи', 'Экипировка']

  if (loading) return <div className="container mx-auto p-4">Загрузка...</div>

  return (
    <div className="container mx-auto p-4 max-w-lg pb-24">
      <h1 className="text-2xl font-bold mb-4">⚽ Каталог товаров</h1>
      
      <div className="mb-4 space-y-2">
        <Input 
          placeholder="Поиск товаров..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'Все' : cat}
            </Button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p>Товары не найдены</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="p-0 relative">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-32 object-cover cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-32 flex items-center justify-center">
                    <span className="text-gray-500">Нет фото</span>
                  </div>
                )}
                {product.is_new && (
                  <Badge className="absolute top-2 left-2 bg-green-500">Новинка</Badge>
                )}
                {product.is_sale && (
                  <Badge className="absolute top-2 right-2 bg-red-500">Распродажа</Badge>
                )}
              </CardHeader>
              <CardContent className="p-3">
                <h3 className="font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                {product.is_sale && product.old_price ? (
                  <div className="mt-1">
                    <span className="line-through text-gray-500">{product.old_price} ₽</span>
                    <span className="ml-2 font-bold">{product.price} ₽</span>
                  </div>
                ) : (
                  <p className="font-bold">{product.price} ₽</p>
                )}
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => addToCart(product)}
                >
                  В корзину
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}