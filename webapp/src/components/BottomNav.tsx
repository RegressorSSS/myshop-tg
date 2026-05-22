import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const BottomNav = () => {
  const location = useLocation();
  const [count, setCount] = useState(0);

  // Функция обновления счётчика из localStorage
  const updateCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    setCount(total);
  };

  useEffect(() => {
    updateCount();
    // Слушаем изменения localStorage (когда корзина меняется в других вкладках)
    window.addEventListener('storage', updateCount);
    // Также можно перехватывать свои события, если нужно
    const interval = setInterval(updateCount, 500); // временный костыль, но надёжно
    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  // Также принудительно обновляем при фокусе окна
  useEffect(() => {
    const handleFocus = () => updateCount();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50">
      <Link to="/" className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-green-600' : 'text-gray-500'}`}>
        <span className="text-xl">🏠</span>
        <span className="text-xs">Каталог</span>
      </Link>
      <Link to="/cart" className={`flex flex-col items-center p-2 relative ${isActive('/cart') ? 'text-green-600' : 'text-gray-500'}`}>
        <div className="relative">
          <span className="text-xl">🛒</span>
          {count > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </div>
        <span className="text-xs">Корзина</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-green-600' : 'text-gray-500'}`}>
        <span className="text-xl">👤</span>
        <span className="text-xs">Профиль</span>
      </Link>
    </div>
  );
};

export default BottomNav;
