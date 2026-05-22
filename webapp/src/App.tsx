// src/App.tsx
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import ProfileOrders from './pages/ProfileOrders';
import UploadTest from './pages/UploadTest';
import AdminCreateProduct from './pages/AdminCreateProduct';
import AdminEditProduct from './pages/AdminEditProduct';

function Layout() {
  const location = useLocation();
  const hideNav = location.pathname.startsWith('/product/') || location.pathname === '/upload-test';

  return (
    <div className="min-h-screen bg-white min-w-[320px]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/orders" element={<ProfileOrders />} />
        <Route path="/upload-test" element={<UploadTest />} />
        <Route path="/admin/create-product" element={<AdminCreateProduct />} />
        <Route 
          path="/admin/edit-product/:id" 
          element={<AdminEditProduct key={location.pathname} />} 
        />
      </Routes>
      {!hideNav && <BottomNav />}
    </div>
  );
}

function App() {
  const [isTelegramWebApp, setIsTelegramWebApp] = useState<boolean | null>(null);

  useEffect(() => {
    const checkTelegram = () => {
      const telegram = window.Telegram?.WebApp;
      if (telegram && telegram.initData) {
        setIsTelegramWebApp(true);
        telegram.ready();
        telegram.expand();
      } else {
        setIsTelegramWebApp(false);
      }
    };
    checkTelegram();
  }, []);

  if (isTelegramWebApp === null) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }

  if (!isTelegramWebApp) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h1 className="text-2xl font-bold mb-4">🚫 Доступ только через Telegram</h1>
        <p className="text-gray-600 mb-4">
          Это приложение работает только внутри Telegram.<br />
          Пожалуйста, откройте его через нашего бота:
        </p>
        <a 
          href="https://t.me/gasuboots_bot" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <span>📱</span> Открыть бота в Telegram
        </a>
        <p className="text-xs text-gray-400 mt-6">
          Нажмите кнопку «Open» / «Запустить» внутри бота.
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <CartProvider>
        <Layout />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;