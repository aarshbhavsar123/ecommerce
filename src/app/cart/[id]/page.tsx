"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Divider,
  IconButton,
  Modal,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAddressIndex } from "@/redux/slices/authSlices"; 
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { useAppContext } from "@/context";
import axios from "axios";
import { useRouter } from "next/navigation";

const ShoppingCart = () => {
  const { user } = useAppContext();
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/cart/get-cart/${user.id}`);
          setCartItems(response.data.cart.products);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }
    };
    fetchCart();
  }, [user]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  const handleDelete = async (product_id, event) => {
    event.stopPropagation();
    if (user) {
      try {
        await axios.post(`/api/cart/remove-items/${user.id}/${product_id}`);
        alert("Item removed successfully");
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.product._id !== product_id)
        );
      } catch (error) {
        console.error("Error removing the item from the cart:", error);
      }
    }
  };

  const updateQuantity = async (product_id:any, newQuantity:any, event:any) => {
    event.stopPropagation();
    if (user) {
      try {
        await axios.post(`/api/cart/update-quantity/${user.id}/${product_id}`, { quantity: newQuantity });
        setCartItems((prevItems:any) =>
          prevItems.map((item:any) =>
            item.product._id === product_id ? { ...item, quantity: newQuantity } : item
          )
        );
      } catch (error) {
        console.error("Error updating the item quantity:", error);
      }
    }
  };

  const handleItemClick = (productId:any) => {
    router.push(`/product-overview/${productId}`);
  };

  const proceed = async () => {
    try {
      const response = await axios.get(`/api/users/get-addresses/${user.id}`);
      setAddresses(response.data || []);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleCloseModal = () => setModalOpen(false);
  const dispatch = useDispatch();
  const selectedAddressIndex = useSelector((state:any) => state.auth.selectedAddressIndex);
  const handleSelectAddress = (index:any) => {
    dispatch(setSelectedAddressIndex(index));
  };
  return (
    <Box sx={{ backgroundColor: "background.default", py: 8, color: "text.primary" }}>
      <Box sx={{ maxWidth: "screen-xl", mx: "auto", px: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "semibold", mb: 4 }}>
          Shopping Cart
        </Typography>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {cartItems.map((item) => (
                <Paper
                  key={item.product._id}
                  sx={{
                    p: 3,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-2px)",
                    },
                  }}
                  onClick={() => handleItemClick(item.product._id)}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={2}>
                      <Box
                        component="img"
                        src={item.product.images?.[0] || "/placeholder.jpg"}
                        alt={item.product.product_name}
                        sx={{ width: 80, height: 80 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                        {item.product.product_name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        ${item.product.price}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={(e) => handleDelete(item.product._id, e)}
                          sx={{ color: "error.main" }}
                          disableRipple
                        >
                          Remove
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton size="small" disableRipple onClick={(e) => updateQuantity(item.product._id, Math.max(1, item.quantity - 1), e)}>
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          type="text"
                          value={item.quantity}
                          sx={{ width: 60, textAlign: "center" }}
                          inputProps={{ style: { textAlign: "center" }, readOnly: true }}
                        />
                        <IconButton size="small" disableRipple onClick={(e) => updateQuantity(item.product._id, item.quantity + 1, e)}>
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "right" }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          </Grid>

          {/* Checkout Box */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body1">Estimated Tax (5%):</Typography>
                <Typography variant="body1">${tax.toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Total:</Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>${total.toFixed(2)}</Typography>
              </Box>

              <Button variant="contained" color="primary" fullWidth sx={{ py: 1.5, fontSize: "16px", fontWeight: "bold" }} disableRipple onClick={proceed}>
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Modal
  open={modalOpen}
  onClose={handleCloseModal}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <Box
    sx={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
      outline: "none", 
    }}
  >
    <Typography id="modal-title" variant="h6" sx={{ mb: 2 }}>
      Select Your Address
    </Typography>
    <FormGroup>
      {addresses.map((address, index) => (
        <FormControlLabel
          key={index}
          control={
            <Radio
              checked={selectedAddressIndex === index}
              onChange={() => handleSelectAddress(index)} // ✅ Corrected here
            />
          }
          label={address}
        />
      ))}
    </FormGroup>
    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
      <Button onClick={handleCloseModal} sx={{ mr: 1 }}>
        Cancel
      </Button>
      <Button variant="contained" color="primary" onClick={()=>router.push("/order-summary?cart=1")}>
        Confirm Address
      </Button>
    </Box>
  </Box>
</Modal>


    </Box>
  );
};

export default ShoppingCart;
