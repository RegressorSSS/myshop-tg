export interface Product {
  id: number;
  name: string;
  price: number;
  // Добавь эти поля:
  image_url?: string;    // URL картинки
  category?: string;     // Категория товара
  is_new?: boolean;      // Флаг "Новинка"
  stock?: number;        // Количество на складе
  description?: string;
  is_sale?: boolean;
  old_price?: number;
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  color?: string;
}