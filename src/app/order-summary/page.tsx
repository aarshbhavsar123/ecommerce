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
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const cart = searchParams.get("cart");
  const product_id = searchParams.get("product_id");
  const order_id = searchParams.get("order_id");
  const selectedAddressIndex = useSelector(
    (state: any) => state.auth.selectedAddressIndex
  );
  const quantityRed = useSelector((state: any) => state.auth.quantityRed);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/cart/get-cart/${user.id}`);
          if (response.data?.cart?.products?.length > 0) {
            setCartItems(response.data.cart.products);
            setAddress(
              user.addresses[selectedAddressIndex] ||
                localStorage.getItem("address") ||
                ""
            );
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
          const response = await axios.get(
            `/api/products/get-product/${product_id}`
          );
          if (response.data) {
            setCartItems([{ product: response.data }]);
            setAddress(
              user.addresses[selectedAddressIndex] ||
                localStorage.getItem("address") ||
                ""
            );
          }
        } catch (error) {
          console.error("Error fetching the product details:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    const fetchOrderDetails = async () => {
      if (user && order_id) {
        try {
          
          const orderResponse = await axios.get(`/api/order/get-order/${order_id}`);
          
          if (orderResponse.data) {
            console.log(orderResponse.data);
            setOrderDetails(orderResponse.data);
            setAddress(orderResponse.data.address);
            
            
            const productPromises = [];
            
            
            for (const item of orderResponse.data.items) {
              const productPromise = axios.get(`/api/products/get-product/${item.product_id}`)
                .then(productRes => {
                  return {
                    product: productRes.data,
                    quantity: item.quantity
                  };
                })
                .catch(err => {
                  console.error(`Error fetching product ${item.product_id}:`, err);
                 
                  return {
                    product: { 
                      product_name: `Product ID: ${item.product_id}`, 
                      price: 0,
                      images: []
                    },
                    quantity: item.quantity
                  };
                });
              
              productPromises.push(productPromise);
            }
            
            
            const orderProducts = await Promise.all(productPromises);
            setCartItems(orderProducts);
          }
        } catch (e) {
          console.error("Error fetching order details:", e);
        } finally {
          setLoading(false);
        }
      }
    };
    
    if (cart === "1") {
      fetchCart();
    } else if (cart === "0") {
      fetchProduct();
    } else if (cart === "2") {
      fetchOrderDetails();
    }
  }, [user, order_id, product_id, selectedAddressIndex]);

  const handlePlaceOrder = async () => {
    if (cart === "1") {
      try {
        const obj = {
          userId: user.id,
          address,
          cart: cartItems,
          quantity: null,
        };
        const response = await axios.post(`/api/order/add-order`, obj);
        console.log(response.data);
        alert("Order Placed successfully");
        router.push("/home");
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      }
    } else if (cart === "0") {
      try {
        const obj = {
          userId: user.id,
          address: localStorage.getItem("address"),
          cart: cartItems,
          quantity: localStorage.getItem("quantity"),
        };
        const response = await axios.post(`/api/order/add-order`, obj);
        alert("Order Placed successfully");
        router.push("/home");
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  console.log("Cart items:", cartItems); 

  const originalPrice =
    cartItems?.reduce(
      (sum, item) =>
        sum +
        (item?.product?.price || 0) *
          (cart === "1"
            ? item.quantity
            : cart === "2"
            ? item.quantity
            : Number(localStorage.getItem("quantity")) || 1),
      0
    ) || 0;

  const tax = originalPrice * 0.05;
  const total = originalPrice + tax;

  return (
    <Box sx={{ bgcolor: "background.paper", py: 8, px: 4 }}>
      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        <Typography variant="h4" sx={{ fontWeight: "semibold", mb: 4 }}>
          {cart === "2" ? "Order Details" : "Order Summary"}
        </Typography>

        <Box
          sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider", py: 4 }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Billing & Delivery information
          </Typography>
          <Typography variant="body1">
            Delivering to {address ? address : localStorage.getItem("address")}
          </Typography>
          
          {cart === "2" && orderDetails && (
            <>
              
              <Typography variant="body1">
                Order Date: {new Date(orderDetails.createdAt).toLocaleString()}
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Items in {cart === "2" ? "Order" : "Cart"}
          </Typography>
          <Table>
            <TableBody>
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          component="img"
                          src={item?.product?.images?.[0] || ""}
                          alt={item?.product?.product_name || "Product image"}
                          sx={{ width: 40, height: 40, objectFit: "cover" }}
                        />
                        <Typography variant="body1">
                          {item?.product?.product_name || "Unknown Product"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      x
                      {cart === "1"
                        ? item.quantity
                        : cart === "2"
                        ? item.quantity
                        : Number(localStorage.getItem("quantity")) || 1}
                    </TableCell>
                    <TableCell align="right">
                      $
                      {(
                        (cart === "1"
                          ? item.product?.price * item.quantity
                          : cart === "2"
                          ? item.product?.price * item.quantity
                          : item.product?.price *
                            (Number(localStorage.getItem("quantity")) || 1)) ||
                        0
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No items in this {cart === "2" ? "order" : "cart"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Order summary
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              Original price: ${originalPrice.toFixed(2)}
            </Typography>
            <Typography variant="body1">Tax (5%): ${tax.toFixed(2)}</Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              borderTop: 1,
              borderColor: "divider",
              pt: 2,
            }}
          >
            Total: ${total.toFixed(2)}
          </Typography>
        </Box>

        {(cart === "1" || cart === "0") && (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              sx={{ mr: 2 }}
              onClick={() => router.push("/home")}
            >
              Return to Shopping
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </Box>
        )}
        
        {cart === "2" && (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => router.push("/home")}
            >
              Return to Home
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;