
export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;  // ← из БД (snake_case)
  category?: string;
  is_new?: boolean;    // ← из БД
  created_at?: string; // ← из БД
  // Для удобства в интерфейсе можно добавить алиасы:
  image?: string;      // = image_url
  isNew?: boolean;     // = is_new
}

export interface CartItem extends Product {
  quantity: number;
}