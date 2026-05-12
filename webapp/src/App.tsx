// src/App.tsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
//import  WebApp  from '@twa-dev/sdk'
import { CartProvider } from './contexts/CartContext' 
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import ProfileOrders from './pages/ProfileOrders'
import UploadTest from './pages/UploadTest' 
import AdminCreateProduct from './pages/AdminCreateProduct'
import AdminEditProduct from './pages/AdminEditProduct'

function Layout() {
  const location = useLocation()
  // Скрываем навигацию на страницах товара и загрузки
  const hideNav = location.pathname.startsWith('/product/') || location.pathname === '/upload-test'

  return (
    <div className="min-h-screen bg-white min-w-[320px]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/orders" element={<ProfileOrders />} />
        <Route path="/upload-test" element={<UploadTest />} /> {/* Роут уже был */}
        <Route path="/admin/create-product" element={<AdminCreateProduct />} />
        <Route path="/admin/edit-product/:id" element={<AdminEditProduct />} />
      </Routes>
      
      {!hideNav && <BottomNav />}
    </div>
  )
}

function App() {
  useEffect(() => {
  // Принудительно обновляем layout после загрузки
  const timer = setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 300);
  return () => clearTimeout(timer);
}, []);

  return (
    <BrowserRouter>
      <CartProvider>
        <Layout />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App