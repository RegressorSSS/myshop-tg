import { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'

const products = [
  { id: 1, name: 'Товар 1', price: 1000, image: 'https://placehold.co/400x300/3b82f6/white?text=Product+1' },
  { id: 2, name: 'Товар 2', price: 2000, image: 'https://placehold.co/400x300/ef4444/white?text=Product+2' },
  { id: 3, name: 'Товар 3', price: 3000, image: 'https://placehold.co/400x300/10b981/white?text=Product+3' },
  { id: 4, name: 'Товар 4', price: 1500, image: 'https://placehold.co/400x300/f59e0b/white?text=Product+4' },
]

function App() {
  const [user, setUser] = useState<{ first_name?: string } | null>(null)

  useEffect(() => {
    WebApp.ready()
    WebApp.expand()
    setUser(WebApp.initDataUnsafe?.user || null)
  }, [])

  const handleBuy = (product: typeof products[0]) => {
    WebApp.showAlert(`✅ Куплено: ${product.name} за ${product.price} ₽`)
    WebApp.showPopup({
      title: 'Покупка',
      message: `Вы успешно приобрели ${product.name} за ${product.price} ₽`,
      buttons: [{ type: 'ok' }]
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">🛍️ Мой магазин</h1>
        {user && (
          <span className="text-gray-600">Привет, {user.first_name}!</span>
        )}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-2xl font-bold text-blue-600 my-2">{product.price} ₽</p>
              <button
                onClick={() => handleBuy(product)}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
              >
                Купить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App