export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  category: string;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}