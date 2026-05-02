import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/types'

// В реальности данные придут с сервера
const PRODUCTS_DB: Record<number, Product> = {
  1: { id: 1, name: 'Mizuno Morelia Neo IV', price: 24990, oldPrice: 29990, image: 'https://placehold.co/600x600/f5f5f5/333?text=Mizuno+Neo', description: 'Легендарная серия Morelia возвращается с новыми технологиями. Натуральная кожа kangaroo, облегченный вес и идеальный контроль мяча.', category: 'Бутсы', isNew: true },
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const product = PRODUCTS_DB[Number(id)]

  if (!product) {
    return <div className="p-10 text-center">Товар не найден <br/><Button onClick={() => navigate('/')}>На главную</Button></div>
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="border-b p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>←</Button>
        <h1 className="text-lg font-medium truncate">{product.name}</h1>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center aspect-square">
            <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-500">{product.category}</p>
            </div>
            <div className="text-3xl font-bold">
              {product.price} ₽
              {product.oldPrice && <span className="ml-3 text-xl text-gray-400 line-through">{product.oldPrice} ₽</span>}
            </div>
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