"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function Button({ productId, initialQuantity }: { productId: number, initialQuantity: number }) {
  const [state, setState] = useState(initialQuantity);
  const [added, setAdded] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    const storedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    if (storedCart[userId] && storedCart[userId][productId]) {
      setState(storedCart[userId][productId]);
      setAdded(true);
    }
  }, [productId]);

  const updateCartState = (quantity: number) => {
    if (!userId) return;

    const storedCart = JSON.parse(localStorage.getItem("cart") || "{}");

    if (!storedCart[userId]) storedCart[userId] = {};

    if (quantity === 0) {
      delete storedCart[userId][productId];
    } else {
      storedCart[userId][productId] = quantity;
    }

    localStorage.setItem("cart", JSON.stringify(storedCart));
  };

  const handleClick = () => {
    alert(added ? "Item removed from the cart" : "Item added to the cart");
    if (!added) {
      setAdded(true);
      setState(1);
      updateCartState(1);
    } else {
      setAdded(false);
      setState(0);
      updateCartState(0);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="text-center mb-6">
        <button
          onClick={handleClick}
          className={`w-full p-3 rounded-md text-white ${added ? "bg-red-600" : "bg-blue-600"} transition duration-300`}
        >
          {added ? "Remove From Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
