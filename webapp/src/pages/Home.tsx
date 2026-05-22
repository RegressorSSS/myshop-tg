import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Product } from '../types'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [, forceUpdate] = useState({})

  const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]')
  const saveCart = (cart: any[]) => {
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('storage'))
    forceUpdate({})
  }

  const getQuantity = (id: number) => {
    const cart = getCart()
    const item = cart.find((i: any) => i.id === id)
    return item ? item.quantity : 0
  }

  const addToCart = (product: Product) => {
    const cart = getCart()
    const existing = cart.find((i: any) => i.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    saveCart(cart)
  }

  const removeOne = (product: Product) => {
    const cart = getCart()
    const index = cart.findIndex((i: any) => i.id === product.id)
    if (index !== -1) {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1
      } else {
        cart.splice(index, 1)
      }
      saveCart(cart)
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (category) params.append('category', category)
        const res = await api.products.list(params)
        const data = await res.json()
        setProducts(data.products || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [search, category])

  useEffect(() => {
    const handleStorage = () => forceUpdate({})
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <div className="container mx-auto p-2 pb-24">
      <div className="mb-2">
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-md text-sm"
        />
      </div>
      <div className="flex gap-1 mb-3 overflow-x-auto">
        {['Все', 'Бутсы', 'Мячи', 'Экипировка'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat === 'Все' ? '' : cat)}
            className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
              (category === cat || (cat === 'Все' && category === ''))
                ? 'bg-green-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-center py-8">Загрузка...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Товары не найдены</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {products.map((product) => {
            const quantity = getQuantity(product.id)
            return (
              <div key={product.id} className="border rounded-md bg-white shadow-sm overflow-hidden">
                <Link to={`/product/${product.id}`} className="block">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-28 object-cover"
                    />
                  )}
                  <div className="p-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <div>
                        <span className="text-sm font-bold text-green-600">{product.price} ₽</span>
                        {product.old_price && (
                          <span className="text-xs line-through text-gray-400 ml-1">{product.old_price} ₽</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-2 pb-2">
                  {quantity === 0 ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-green-600 text-white text-xs py-1 rounded-md"
                    >
                      В корзину
                    </button>
                  ) : (
                    <div className="flex items-center justify-between gap-1">
                      <button
                        onClick={() => removeOne(product)}
                        className="flex-1 border rounded py-1 text-center text-sm"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 border rounded py-1 text-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}