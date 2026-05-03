// src/App.tsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { WebApp } from '@twa-dev/sdk'
import { CartProvider } from './contexts/CartContext' // <-- ПРОВЕРЬ ЭТОТ ИМПОРТ
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import ProfileOrders from './pages/ProfileOrders'

function Layout() {
  const location = useLocation()
  const hideNav = location.pathname.startsWith('/product/')

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/orders" element={<ProfileOrders />} />
      </Routes>
      
      {!hideNav && <BottomNav />}
    </div>
  )
}

function App() {
  useEffect(() => {
    if (WebApp) {
      WebApp.ready()
      WebApp.expand()
      if (WebApp.colorScheme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  return (
    <BrowserRouter>
      <CartProvider>
        <Layout />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App