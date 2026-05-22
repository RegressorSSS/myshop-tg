import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '../lib/api';

declare global {
  interface Window {
    Telegram?: any;
  }
}

const ADMIN_IDS = [323205122, 709145946];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.products.get(id!);
        if (!res.ok) throw new Error('Товар не найден');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

    const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
    setIsAdmin(user && ADMIN_IDS.includes(user.id));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить товар?')) return;
    try {
      const initData = window.Telegram?.WebApp?.initData || '';
      const res = await api.products.delete(id!, initData);
      if (!res.ok) throw new Error('Ошибка удаления');
      alert('Товар удалён');
      navigate('/');
    } catch (err) {
      alert('Не удалось удалить товар');
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">Загрузка...</div>;
  if (!product) return null;

  return (
    <div className="container mx-auto p-4 pb-24">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-1">
          ← Назад в каталог
        </Button>
      </div>

      <Card>
        {product.image_url && (
          <img src={product.image_url} alt={product.name} className="w-full h-64 object-cover rounded-t-lg" />
        )}
        <CardContent className="space-y-4 pt-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="text-xl font-bold text-green-600">{product.price} ₽</div>
          {product.old_price && (
            <div className="text-sm line-through text-gray-500">{product.old_price} ₽</div>
          )}
          <div>Категория: {product.category}</div>
          <div className="text-gray-700">{product.description}</div>

          {isAdmin && (
            <div className="flex gap-2 pt-4">
              <Button onClick={() => navigate(`/admin/edit-product/${id}`)} variant="outline">
                ✏️ Редактировать
              </Button>
              <Button onClick={handleDelete} variant="destructive">
                🗑️ Удалить
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
