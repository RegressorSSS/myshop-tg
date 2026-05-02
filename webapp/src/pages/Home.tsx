import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

// Заглушка данных (позже заменим на API)
const PRODUCTS: Product[] = [
  { id: 1, name: 'Mizuno Morelia Neo IV', price: 24990, oldPrice: 29990, image: 'https://placehold.co/600x600/f5f5f5/333?text=Mizuno+Neo', description: 'Классические кожаные бутсы.', category: 'Бутсы', isNew: true },
  { id: 2, name: 'Nike Mercurial Vapor 15', price: 19990, image: 'https://placehold.co/600x600/f5f5f5/333?text=Nike+Merc', description: 'Скорость и легкость.', category: 'Бутсы' },
  { id: 3, name: 'Adidas Predator Edge', price: 22500, oldPrice: 25000, image: 'https://placehold.co/600x600/f5f5f5/333?text=Adidas+Pred', description: 'Контроль мяча.', category: 'Бутсы', isNew: true },
  { id: 4, name: 'Puma Future Ultimate', price: 21000, image: 'https://placehold.co/600x600/f5f5f5/333?text=Puma+Future', description: 'Адаптивная посадка.', category: 'Бутсы' },
]

export default function Home() {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">⚽ MYSHOP</h1>
          <Button variant="ghost" size="sm" onClick={() => navigate('/cart')}>
            Корзина
          </Button>
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
      <main id="products" className="container mx-auto px-4 py-10">
        <h3 className="text-xl font-semibold mb-6">Каталог</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {PRODUCTS.map(p => (
            <Card key={p.id} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all">
              <div onClick={() => navigate(`/product/${p.id}`)} className="relative aspect-square bg-gray-100 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
                {p.isNew && <Badge className="absolute top-2 left-2 bg-black text-white">New</Badge>}
                {p.oldPrice && <Badge className="absolute top-2 right-2 bg-red-500 text-white">Sale</Badge>}
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-gray-400 mb-1">{p.category}</p>
                <h4 className="font-medium leading-tight mb-2 line-clamp-2">{p.name}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold">{p.price} ₽</span>
                  {p.oldPrice && <span className="text-sm text-gray-400 line-through">{p.oldPrice} ₽</span>}
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