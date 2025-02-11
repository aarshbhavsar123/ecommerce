'use client';

import { useState, useEffect } from "react";

export default function Cart() {
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage

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

  useEffect(() => {
    if (!userId) return; // Ensure user is logged in

    const storedData = JSON.parse(localStorage.getItem("cart") || "{}");
    setCart(storedData[userId] || {}); // Load cart for the logged-in user
  }, []);

  const handleRemoveItem = (productId: number) => {
    if (!userId) return;

    const storedData = JSON.parse(localStorage.getItem("cart") || "{}");
    if (storedData[userId]) {
      delete storedData[userId][productId]; // Remove product for that user
      localStorage.setItem("cart", JSON.stringify(storedData));
      setCart(storedData[userId]);
    }
  };

  const totalPrice = Object.keys(cart).reduce((total, productId) => {
    const product = products.find((p) => p.id === Number(productId));
    return total + (product?.price || 0) * (cart[Number(productId)] || 0);
  }, 0);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {Object.keys(cart).length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {Object.keys(cart).map((productId) => {
              const product = products.find((p) => p.id === Number(productId));
              if (!product) return null;
              return (
                <li key={productId} className="mb-4 flex justify-between items-center">
                  <span>{product.name}</span>
                  <span>Quantity: {cart[Number(productId)]}</span>
                  <span>Price: ${product.price * cart[Number(productId)]}</span>
                  <button
                    onClick={() => handleRemoveItem(Number(productId))}
                    className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4">
            <p className="font-bold">Total Price: ${totalPrice}</p>
          </div>
        </div>
      )}
    </div>
  );
}
