import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { IconBuildingStore, IconShoppingCart, IconUser } from '@tabler/icons-react';

const BottomNav = () => {
  const location = useLocation();
  const { count } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50">
      <Link to="/" className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-green-600' : 'text-gray-500'}`}>
        <IconBuildingStore size={24} stroke={1.5} />
        <span className="text-xs mt-1">Каталог</span>
      </Link>
      <Link to="/cart" className={`flex flex-col items-center p-2 relative ${isActive('/cart') ? 'text-green-600' : 'text-gray-500'}`}>
        <div className="relative">
          <IconShoppingCart size={24} stroke={1.5} />
          {count > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </div>
        <span className="text-xs mt-1">Корзина</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-green-600' : 'text-gray-500'}`}>
        <IconUser size={24} stroke={1.5} />
        <span className="text-xs mt-1">Профиль</span>
      </Link>
    </div>
  );
};

export default BottomNav;