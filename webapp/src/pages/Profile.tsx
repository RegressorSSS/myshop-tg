import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    Telegram?: any;
  }
}

const ADMIN_ID = 323205122; // Жёстко задаём ID админа

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      setUser(window.Telegram.WebApp.initDataUnsafe.user);
    } else {
      console.log('No Telegram user data');
    }
  }, []);

  const isAdmin = user && user.id === ADMIN_ID;

  return (
    <div className="container mx-auto p-4 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-3xl">
                {user.photo_url ? (
                  <img src={user.photo_url} alt="avatar" className="rounded-full" />
                ) : (
                  <span>{user.first_name?.charAt(0)}{user.last_name?.charAt(0)}</span>
                )}
              </div>
              <h2 className="text-xl font-bold mt-2">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-500">@{user.username}</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Не удалось получить данные пользователя</p>
              <p className="text-sm">Убедитесь, что приложение открыто из Telegram Mini App</p>
            </div>
          )}

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span>Ваши бонусы</span>
              <span className="font-bold">0 ₽</span>
            </div>
          </div>

          <div className="space-y-2">
            {isAdmin && (
              <Link to="/admin/create-product">
                <Button variant="outline" className="w-full justify-start">
                  📦 Админка: Добавить товар
                </Button>
              </Link>
            )}
            <Link to="/profile/orders">
              <Button variant="outline" className="w-full justify-start">
                📋 История заказов
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start">
              🎟️ Промокоды
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}