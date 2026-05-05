import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Home() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Состояния фильтров
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    isNew: false,
    isSale: false,
    sortBy: 'created_at',
  })

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('search', filters.search)
      if (filters.minPrice) params.append('min_price', filters.minPrice)
      if (filters.maxPrice) params.append('max_price', filters.maxPrice)
      if (filters.isNew) params.append('new', 'true')
      if (filters.isSale) params.append('sale', 'true')
      if (filters.sortBy) params.append('sort', filters.sortBy)

      const res = await fetch(`http://localhost:8080/api/products?${params}`)
      if (!res.ok) throw new Error('Не удалось загрузить товары')
      const data = await res.json()
      setProducts(data.products)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (loading) return <div className="p-10 text-center">Загрузка товаров...</div>
  if (error) return <div className="p-10 text-center text-red-500">Ошибка: {error}</div>

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">⚽ MYSHOP</h1>
          <Button variant="ghost" size="sm" onClick={() => navigate('/cart')}>Корзина</Button>
        </div>
      </header>

      {/* Панель фильтров */}
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
            <Select value={filters.category} onValueChange={(v) => handleFilterChange('category', v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Бутсы">Бутсы</SelectItem>
                <SelectItem value="Мячи">Мячи</SelectItem>
                <SelectItem value="Экипировка">Экипировка</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              type="number" 
              placeholder="От" 
              className="w-[100px]"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <Input 
              type="number" 
              placeholder="До" 
              className="w-[100px]"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
            <Button 
              variant={filters.isSale ? "default" : "outline"} 
              size="sm"
              onClick={() => handleFilterChange('isSale', !filters.isSale)}
            >
              🔥 Sale
            </Button>
            <Button 
              variant={filters.isNew ? "default" : "outline"} 
              size="sm"
              onClick={() => handleFilterChange('isNew', !filters.isNew)}
            >
              ✨ New
            </Button>
            <Select value={filters.sortBy} onValueChange={(v) => handleFilterChange('sortBy', v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">По дате</SelectItem>
                <SelectItem value="price_asc">Цена: низкая → высокая</SelectItem>
                <SelectItem value="price_desc">Цена: высокая → низкая</SelectItem>
                <SelectItem value="name">По названию</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={() => setFilters({
              category: '', search: '', minPrice: '', maxPrice: '', isNew: false, isSale: false, sortBy: 'created_at'
            })}>
              Сбросить
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <Card key={p.id} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all">
              <div onClick={() => navigate(`/product/${p.id}`)} className="relative aspect-square bg-gray-100 overflow-hidden">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
                {p.is_new && <Badge className="absolute top-2 left-2 bg-black text-white">New</Badge>}
                {p.is_sale && <Badge className="absolute top-2 right-2 bg-red-500 text-white">Sale</Badge>}
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-gray-400 mb-1">{p.category}</p>
                <h4 className="font-medium leading-tight mb-2 line-clamp-2">{p.name}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold">{p.price} ₽</span>
                  {p.old_price && <span className="text-sm text-gray-400 line-through">{p.old_price} ₽</span>}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={(e) => { e.stopPropagation(); addToCart(p) }}>
                  В корзину
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}