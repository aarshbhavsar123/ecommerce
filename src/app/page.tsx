'use client';

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from '../context'; 

export default function Home() {
  const state = useAppContext();
  const router = useRouter();
  const [cart, setCart] = useState<{ [key: string]: number }>({}); // Updated to string keys for Mongoose _id

  useEffect(() => {
    if (state?.user?.cart) {
      const cartItems = state.user.cart.reduce((acc: { [key: string]: number }, item: any) => {
        acc[item._id] = item.quantity;
        return acc;
      }, {});
      setCart(cartItems);
    }
  }, [state]);

  const handleCardClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleAddToCart = (event: React.MouseEvent, productId: string) => {
    event.stopPropagation();
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1,
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Your Cart</h2>
      {state?.user?.cart && state.user.cart.length > 0 ? (
        <ul>
          {state.user.cart.map((item: any) => (
            <li key={item._id} className="border-b p-2 flex justify-between">
              <span>{item.name} (x{cart[item._id] || item.quantity})</span>
              <button
                onClick={(e) => handleAddToCart(e, item._id)}
                className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add More
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}
