'use client';

import { FiSearch } from 'react-icons/fi';
import { BsCartFill } from 'react-icons/bs';
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useAppContext } from '../context'; 
import React from "react";
import { User } from 'lucide-react';

export default function Header() {
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  const state  = useAppContext(); 
  
  useEffect(() => {
   
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    
    if (storedUserId) {
      const storedData = JSON.parse(localStorage.getItem("cart") || "{}");
      setCart(storedData[storedUserId] || {});
    }
  }, [state]);

 
  const uniqueItemsCount = Object.keys(cart).length;

  const handleCartClick = () => {
    console.log(state);
    router.push("/cart");
  };

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged Out Successfully");

      
      localStorage.removeItem("userId");
      localStorage.removeItem("cart");

      router.push("/login");
    } catch (e: any) {
      console.log(e.message);
      toast.error(e.message);
    }
  };

  return (
    <>
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          
          <h1 className="text-xl font-bold">
            <Link href="/">amazon</Link>
          </h1>

          
          {!(pathname === "/login" || pathname === "/signup") && (
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="p-2 pl-10 pr-4 bg-gray-700 text-white rounded-md"
              />
              <FiSearch className="absolute left-3 text-gray-400" />
            </div>
          )}

         
          

          {/* Navigation */}
          <nav>
            <ul className="flex gap-4">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li>
                {(pathname === "/login" || pathname === "/signup") ? (
                  <button onClick={() => router.push("/login")}>Login</button>
                ) : (
                  <button onClick={handleLogout}>Logout</button>
                )}
              </li>
              <span className='mx-20'>
                {state.user && state.user.username}
              </span>
            </ul>
          </nav>

          {/* Cart Button */}
          {!(pathname === "/login" || pathname === "/signup") && (
            <button onClick={handleCartClick} className="relative text-white">
              <BsCartFill size={24} />
              {uniqueItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {uniqueItemsCount}
                </span>
              )}
            </button>
          )}
        </div>
      </header>
    </>
  );
}
