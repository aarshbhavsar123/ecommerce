"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Select,
  MenuItem,
  TextareaAutosize,
  Modal,
} from "@mui/material";
import { useAppContext } from "@/context";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); 
  const searchParams = useSearchParams();
  const { user } = useAppContext();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<any>([]);
  const cart = searchParams.get("cart");
  const product_id = searchParams.get("product_id");

  const selectedAddressIndex = useSelector((state: any) => state.auth.selectedAddressIndex);
  const quantityRed = useSelector((state: any) => state.auth.quantityRed);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/cart/get-cart/${user.id}`);
          if (response.data?.cart?.products?.length > 0) {
            setCartItems(response.data.cart.products);
            setAddress(user.addresses[selectedAddressIndex] || localStorage.getItem("address") || "");
          } else {
            setCartItems([]); 
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
          setCartItems([]); 
        } finally {
          setLoading(false); 
        }
      }
    };

    const fetchProduct = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/products/get-product/${product_id}`);
          if (response.data) {
            setCartItems([{ product: response.data }]);
            setAddress(user.addresses[selectedAddressIndex] || localStorage.getItem("address") || "");
          }
        } catch (error) {
          console.error("Error fetching the product details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (cart === "1") {
      fetchCart();
    } else if (cart === "0" && product_id) {
      fetchProduct();
    }
  }, [user]);

  const handlePlaceOrder = async () => {
    if(cart==="1")
    {
      try {
        const obj = { userId: user.id, address, cart: cartItems };
        const response = await axios.post(`/api/order/add-order`, obj);
        console.log(response.data);
        alert("Order Placed successfully");
        router.push("/home");
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      }
    }
    else
    {
      try
      {
        const obj = {userId:user.id,address:localStorage.getItem("address"),cart:cartItems,quantity:localStorage.getItem("quantity")};
        const response = await axios.post(`/api/order/add-order`,obj);
        console.log(response.data);
        alert("Order Placed successfully");
        router.push("/home");
      }
      catch(error)
      {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      }
    }
    
  };

  if (loading) {
    return <Typography>Loading...</Typography>; 
  }

  const originalPrice =
    cartItems?.reduce((sum, item) => sum + (item?.product?.price || 0) * (cart === "1" ? item.quantity : Number(localStorage.getItem("quantity")) || 1), 0) || 0;

  const tax = originalPrice * 0.05;
  const total = originalPrice + tax;

  return (
    <Box sx={{ bgcolor: "background.paper", py: 8, px: 4 }}>
      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        <Typography variant="h4" sx={{ fontWeight: "semibold", mb: 4 }}>
          Order summary
        </Typography>

        <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider", py: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Billing & Delivery information
          </Typography>
          <Typography variant="body1">
            Delivering to {address ? address : localStorage.getItem("address")}
          </Typography>
        </Box>

        {/* Product Table */}
        <Box sx={{ mt: 4 }}>
          <Table>
            <TableBody>
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box component="img" src={item?.product?.images?.[0] || ""} sx={{ width: 40, height: 40 }} />
                        <Typography variant="body1">{item?.product?.product_name || "Unknown Product"}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>x{cart === "1" ? item.quantity : Number(localStorage.getItem("quantity")) || 1}</TableCell>
                    <TableCell align="right">
                      ${((cart === "1" ? item.product?.price * item.quantity : item.product?.price * (Number(localStorage.getItem("quantity")) || 1)) || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No items in cart
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Order Summary Details */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Order summary
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">Original price: ${originalPrice.toFixed(2)}</Typography>
            <Typography variant="body1">Tax (5%): ${tax.toFixed(2)}</Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", borderTop: 1, borderColor: "divider", pt: 2 }}>
            Total: ${total.toFixed(2)}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ mt: 4 }}>
          <Button variant="outlined" sx={{ mr: 2 }} onClick={() => router.push("/home")}>
            Return to Shopping
          </Button>
          <Button variant="contained" color="primary" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
