'use client';

import { notFound } from 'next/navigation';
import Button from './button';
import { useEffect, useState } from 'react';

export default function Product({ params }: { params: { id: string } }) {
  const products = [
    { id: 1, price: 20, name: 'Product 1' },
    { id: 2, price: 30, name: 'Product 2' },
    { id: 3, price: 40, name: 'Product 3' },
    { id: 4, price: 50, name: 'Product 4' },
    { id: 5, price: 60, name: 'Product 5' },
    { id: 6, price: 70, name: 'Product 6' },
    { id: 7, price: 80, name: 'Product 7' },
    { id: 8, price: 90, name: 'Product 8' },
    { id: 9, price: 100, name: 'Product 9' },
    { id: 10, price: 110, name: 'Product 10' },
  ];

  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    const storedData = JSON.parse(localStorage.getItem("cart") || "{}");
    setCart(storedData[userId] || {});
  }, []);

  const product = products.find((p) => p.id.toString() === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-4 flex justify-center items-center flex-col">
      <div>
        <img
          src={`https://picsum.photos/seed/${product.id}/300/200`}
          alt=""
          className="rounded-lg"
        />
      </div>
      <p>Price: ${product.price}</p>
      <p>ID: {product.id}</p>
      <Button productId={product.id} initialQuantity={cart[product.id] || 0} />
    </div>
  );
}
