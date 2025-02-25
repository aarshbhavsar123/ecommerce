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

  export default function Header() {
    const [cart, setCart] = useState<{ [key: number]: number }>({});
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    
    const { user, setUser } = useAppContext();

    const uniqueItemsCount = Object.keys(cart).length;

    const handleCartClick = () => {
      router.push("/cart");
    };

    const handleLogout = async () => {
      try {
        await axios.get("/api/users/logout");
        toast.success("Logged Out Successfully");

        localStorage.removeItem("userId");
        localStorage.removeItem("cart");

        setUser(null); 
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

            {user && (
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
                  {user ? (
                    <button onClick={handleLogout}>Logout</button>
                  ) : (
                    <button onClick={() => router.push("/login")}>Login</button>
                  )}
                </li>
                {user && <span className='mx-20'>{user.username}</span>}
              </ul>
            </nav>
            {/* Cart Button */}
            {user && (
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
    