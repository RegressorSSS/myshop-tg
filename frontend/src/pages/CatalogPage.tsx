import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const CatalogPage = () => {
  const [products, setProducts] =);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1>Каталог товаров</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;