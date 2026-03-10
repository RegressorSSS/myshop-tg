import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Тип для товара
type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string; // URL изображения (пока placeholder)
};

// Пример данных (позже будет из API)
const products: Product[] = [
  {
    id: 1,
    name: "Кроссовки Nike",
    price: 12000,
    description: "Удобные и стильные.",
    image: "https://placehold.co/300x300?text=Nike",
  },
  {
    id: 2,
    name: "Футболка Adidas",
    price: 4000,
    description: "100% хлопок.",
    image: "https://placehold.co/300x300?text=Adidas",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold mb-4 text-center">Товары</h1>
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="mx-2">
            <CardHeader className="p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-contain bg-white rounded-md"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle>{product.name}</CardTitle>
              <p className="text-gray-600">{product.description}</p>
              <p className="font-bold mt-2">{product.price} руб.</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full">
                Подробнее
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}