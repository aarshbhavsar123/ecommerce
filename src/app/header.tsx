'use client';

import { FiSearch } from 'react-icons/fi';
import { BsCartFill } from 'react-icons/bs';
import { MdReceiptLong } from "react-icons/md";
import { FiMenu, FiX } from 'react-icons/fi';
import { IoSettingsOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useAppContext } from '../context';
import React from "react";
import {
  Box,
  Typography,
  Button,
  TextareaAutosize,
  Modal
} from "@mui/material";

export default function Header() {
  const [cartAmount, setCartAmount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [address, setAddress] = useState(""); 
  const router = useRouter();
  const { user, setUser } = useAppContext();

  useEffect(() => {
    if (user) {
      fetchCartData();
    }
  }, []);

  const fetchCartData = async () => {
    try {
      if (!user || !user.id) return;
      const userId = user.id;
      const response = await axios.get(`/api/cart/get-cart/${userId}`);
      
      if (response.data && response.data.cart) {
        setCartAmount(response.data.cart.products.length);
      } else {
        setCartAmount(0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handleCartClick = () => {
    router.push(`/cart/${user.id}`);
    setIsMenuOpen(false);
  };

  const handleOrdersClick = () => {
    router.push("/orders");
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      setUser(null);
      router.push("/login");
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleProfileClick = () => {
    router.push(`/profile/${user.id}`);
  };

  const handleSettingsClick = () => {
    setModalOpen(true);  
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSaveAddress = async () => {
    try {
      if (!user || !user.id) {
        console.error("User not logged in");
        return;
      }

      
      const response = await axios.post("/api/users/add-address", {
        userId: user.id,
        address: address,
      });

      alert("Successfully added the address")
    } catch (error) {
      console.error("Error saving address:", error);
      alert("An error occurred while saving the address.");
    }
  };

  return (
    <>
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              <Link href="/home">amazon</Link>
            </h1>

            <div className="flex md:hidden">
              {user && (
                <div className="flex items-center gap-4 mr-4">
                  <button aria-label="Orders" onClick={handleOrdersClick}>
                    <MdReceiptLong size={20} />
                  </button>
                  <button aria-label="Cart" onClick={handleCartClick}>
                    <BsCartFill size={20} />
                    {cartAmount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2">
                        {cartAmount}
                      </span>
                    )}
                  </button>
                  <button aria-label="Settings" onClick={handleSettingsClick}>
                    <IoSettingsOutline size={20}/>
                  </button>
                </div>
              )}
              <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
            <ul className="flex flex-col md:flex-row gap-4 md:gap-6">
              <li><Link href="/home" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
              <li><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
              <li>
                {user ? (
                  <button onClick={handleLogout}>Logout</button>
                ) : (
                  <button onClick={() => {
                    router.push("/login");
                    setIsMenuOpen(false);
                  }}>Login</button>
                )}
              </li>
              {user && (
                <li className="md:ml-60">
                  <button className="hover:text-[#add8e6]" onClick={handleProfileClick}>
                    {user.username}
                  </button>
                </li>
              )}
            </ul>
          </nav>

          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block md:flex md:items-center gap-4 mt-4 md:mt-0`}>
            {user && (
              <>
                <div className="relative w-full md:w-auto my-4 md:my-0">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-10 py-2 pl-10 pr-4 bg-gray-700 text-white rounded-md"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                <div className="hidden md:flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <button aria-label="Orders" onClick={handleOrdersClick}>
                      <MdReceiptLong size={24} />
                    </button>
                    <span className="text-xs mt-1">Orders</span>
                  </div>

                  <div className="flex flex-col items-center relative">
                    <button aria-label="Cart" onClick={handleCartClick}>
                      <BsCartFill size={24} />
                      {cartAmount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                          {cartAmount}
                        </span>
                      )}
                    </button>
                    <span className="text-xs mt-1">Cart</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <button aria-label="Settings" onClick={handleSettingsClick}>
                      <IoSettingsOutline size={24} />
                    </button>
                    <span className="text-xs mt-1">Settings</span>
                  </div>
                </div>
              </>
            )}
          </div>
          <Modal open={modalOpen} onClose={handleCloseModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Add Your Address
              </Typography>

             
              <TextareaAutosize
                minRows={4}
                placeholder="Enter your full address here..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', marginTop: '16px', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
              />

             
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleCloseModal} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleSaveAddress}>
                  Save Address
                </Button>
              </Box>
            </Box>
          </Modal>
        </div>
      </header>
    </>
  );
}