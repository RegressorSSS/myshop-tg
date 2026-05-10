import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Pencil } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function Home() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [filters, setFilters] = useState({
    category: '',
    search: '',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 500)
    return () => clearTimeout(timer)
  }, [filters.search, filters.category])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('search', filters.search)

      const res = await fetch(`${API_URL}/api/products?${params}`)
      
      if (!res.ok) throw new Error('Ошибка сети')
      
      const data = await res.json()
      const productList = Array.isArray(data.products) ? data.products : []
      setProducts(productList)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetCategory = () => {
    setFilters(prev => ({ ...prev, category: '' }))
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Загрузка...</div>
  if (error) return <div className="p-10 text-center text-red-500">Ошибка: {error}</div>

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">⚽ gasuboots</h1>
        </div>
      </header>

      <section className="bg-gray-50 border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <Input 
                placeholder="Поиск..." 
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={filters.category} onValueChange={(v) => handleFilterChange('category', v)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Бутсы">Бутсы</SelectItem>
                  <SelectItem value="Мячи">Мячи</SelectItem>
                  <SelectItem value="Экипировка">Экипировка</SelectItem>
                </SelectContent>
              </Select>

              {filters.category && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                  onClick={resetCategory}
                  title="Сбросить фильтр"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6 flex-grow pb-20">
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-70">
            <span className="text-4xl mb-2">📦</span>
            <p className="text-gray-600 font-medium">В этой категории пока нет товаров</p>
            <p className="text-sm text-gray-400 mt-1">Попробуйте выбрать "Бутсы" или сбросить фильтры</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <Card key={p.id} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all flex flex-col min-h-[320px]">
              <div className="flex-1 relative aspect-square bg-white overflow-hidden border-b">
                <img 
                  src={`${API_URL}${p.image_url}`} 
                  alt={p.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x600/f5f5f5/333?text=No+Image';
                  }}
                />
                {p.is_new && <Badge className="absolute top-2 left-2 bg-black text-white">New</Badge>}
                {p.is_sale && <Badge className="absolute top-2 right-2 bg-red-500 text-white">Sale</Badge>}
              </div>
              
              <CardContent className="p-4 flex-1">
                <p className="text-xs text-gray-400 mb-1">{p.category}</p>
                <h4 className="font-medium leading-tight mb-2 line-clamp-2">{p.name}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold">{p.price} ₽</span>
                  {p.old_price && <span className="text-sm text-gray-400 line-through">{p.old_price} ₽</span>}
                </div>
              </CardContent>
              
              <CardFooter className="p-3 pt-0 flex gap-2">
                {p.stock > 0 ? (
                  <Button className="flex-1 text-xs h-8" onClick={(e) => { e.stopPropagation(); addToCart(p) }}>
                    В корзину
                  </Button>
                ) : (
                  <span className="flex-1 text-xs h-8 flex items-center justify-center text-gray-500 bg-gray-100 rounded-md">
                    Нет в наличии
                  </span>
                )}
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 shrink-0 border-gray-300 hover:bg-gray-100"
                  onClick={(e) => { 
                    e.stopPropagation()
                    navigate(`/admin/edit-product/${p.id}`) 
                  }}
                  title="Редактировать товар"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}