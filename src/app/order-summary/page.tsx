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
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  IconButton,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from "@/context";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
interface ProductRating {
  [productId: string]: number;
}
const Home = () => {
  
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [productRatings, setProductRatings] = useState<ProductRating>({});

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

  // Payment related states
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [formErrors, setFormErrors] = useState<any>({});
  const [cardCompany, setCardCompany] = useState("");

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
  useEffect(() => {
    // Only fetch ratings if there are products and a user is logged in
    if (cartItems.length > 0 && user?.id) {
      const fetchUserRatings = async () => {
        try {
          const productIds = cartItems.map((item: any) =>
            typeof item.product === 'object' ? item.product._id : item.product
          );
      
          // Correct way: Pass userId and productIds as query params
          const response = await axios.get('/api/ratings/get-user-ratings', {
            params: {
              userId: user.id,
              productIds: productIds.join(',') // Convert array to comma-separated string
            }
          });
      
          // Transform the response into a ratings dictionary
          const ratingsMap = response.data.reduce((acc: any, rating: any) => {
            acc[rating.productId] = rating.rating;
            return acc;
          }, {});
      
          // Update the state with fetched ratings
          setProductRatings(ratingsMap);
        } catch (error) {
          console.error('Error fetching user ratings:', error);
        }
      };
      

      fetchUserRatings();
    }
  }, [cartItems, user?.id]);
  // Detect card company based on card number
  useEffect(() => {
    const detectCardCompany = () => {
      const cardNum = cardNumber.replace(/\s/g, "");
  
      // Only proceed if we have at least 2 digits
      if (cardNum.length < 2) {
        setCardCompany("");
        return;
      }
  
      // Visa: Starts with 4
      if (/^4/.test(cardNum)) {
        setCardCompany("VISA");
      }
      // Mastercard: Starts with 51-55 or 2221-2720
      else if (/^5[1-5]/.test(cardNum) || /^2[2-7][2-9]\d/.test(cardNum)) {
        setCardCompany("MasterCard");
      }
      // American Express: Starts with 34 or 37
      else if (/^3[47]/.test(cardNum)) {
        setCardCompany("American Express");
      }
      // Discover: Starts with 6011, 622126-622925, 644-649, or 65
      else if (/^6(?:011|5|4[4-9]|22(?:1(?:2[6-9]|[3-9])|[2-8]|9[0-1]|9[2-5]))/.test(cardNum)) {
        setCardCompany("Discover");
      }
      // JCB: Starts with 35
      else if (/^35/.test(cardNum)) {
        setCardCompany("JCB");
      }
      // Diners Club: Starts with 30, 36, 38, or 39
      else if (/^3(?:0|[689])/.test(cardNum)) {
        setCardCompany("Diners Club");
      }
      // Maestro: Starts with 5018, 5020, 5038, 5893, 6304, 6759, 6761, 6762, 6763
      else if (/^(?:5018|5020|5038|5893|6304|6759|676[1-3])/.test(cardNum)) {
        setCardCompany("Maestro");
      }
      // UnionPay: Starts with 62
      else if (/^62/.test(cardNum)) {
        setCardCompany("UnionPay");
      }
      // Hipercard: Starts with 606282 or 3841
      else if (/^(606282|3841)/.test(cardNum)) {
        setCardCompany("Hipercard");
      }
      // Elo: Starts with specific bins like 636368, 636297, 504175, etc.
      else if (/^(636368|636297|504175|438935|40117[89]|45763[12]|457393)/.test(cardNum)) {
        setCardCompany("Elo");
      }
      // Eftpos: Starts with 4026, 417500, 4508, 4844, 4913, 4917
      else if (/^(4026|417500|4508|4844|4913|4917)/.test(cardNum)) {
        setCardCompany("Eftpos");
      }
      else {
        setCardCompany("");
      }
    };
  
    detectCardCompany();
  }, [cardNumber]);
  const handleRating = (productId: string, rating: number) => {
    console.log(`Rated product ${productId} with ${rating} stars`);
    
    const rateProduct = async () => {
      try {
        const obj = {
          userId: user.id,
          productId: productId,
          rating: rating
        };
        
        const response = await axios.post("/api/ratings/add-rating", obj);
        
        // Update the ratings for this specific product
        setProductRatings(prevRatings => ({
          ...prevRatings,
          [productId]: rating
        }));
        
        console.log(response.data);
      }
      catch(e: any) {
        console.error('Rating submission error:', e);
      }
    };
    
    rateProduct();
  };

  const validatePaymentForm = () => {
    const errors: any = {};
    
    if (paymentMethod === "creditCard" || paymentMethod === "debitCard") {
      if (!cardNumber.trim()) {
        errors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
        errors.cardNumber = "Enter a valid 16-digit card number";
      }
      
      if (!cardName.trim()) {
        errors.cardName = "Name on card is required";
      }
      
      if (!expiryDate.trim()) {
        errors.expiryDate = "Expiry date is required";
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        errors.expiryDate = "Enter expiry in MM/YY format";
      }
      
      if (!cvv.trim()) {
        errors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(cvv)) {
        errors.cvv = "Enter a valid CVV";
      }
    } else if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        errors.upiId = "UPI ID is required";
      } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(upiId)) {
        errors.upiId = "Enter a valid UPI ID";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Reset form errors when closing
    setFormErrors({});
  };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value);
    // Clear errors when changing payment method
    setFormErrors({});
  };

  const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces after every 4 digits
    const input = event.target.value.replace(/\s/g, "");
    let formatted = "";
    for (let i = 0; i < input.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " ";
      }
      formatted += input[i];
    }
    setCardNumber(formatted.slice(0, 19)); // Limit to 16 digits + 3 spaces
  };

  const handleExpiryDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.replace(/\D/g, "");
    let formatted = "";
    
    if (input.length > 0) {
      formatted = input.slice(0, 2);
      if (input.length > 2) {
        formatted += "/" + input.slice(2, 4);
      }
    }
    
    setExpiryDate(formatted);
  };

  const handleProcessPayment = async () => {
    const isValid = validatePaymentForm();
    
    if (isValid) {
      setProcessingPayment(true);
      
      // Simulate payment processing
      setTimeout(async () => {
        try {
          const obj = {
            userId: user.id,
            address: cart === "1" ? address : localStorage.getItem("address"),
            cart: cartItems,
            quantity: cart === "0" ? localStorage.getItem("quantity") : null,
            paymentMethod,
            paymentDetails: paymentMethod === "cashOnDelivery" ? 
              { method: "COD" } : 
              paymentMethod === "upi" ? 
                { method: "UPI", upiId } : 
                { 
                  method: paymentMethod === "creditCard" ? "Credit Card" : "Debit Card",
                  lastFourDigits: cardNumber.slice(-4),
                  cardCompany: cardCompany || "Unknown"
                }
          };
          
          const response = await axios.post("/api/order/add-order", obj);
          console.log(response.data);
          setProcessingPayment(false);
          setModalOpen(false);
          alert("Order placed successfully!");
          router.push("/home");
        } catch (error) {
          console.error("Error placing order:", error);
          setProcessingPayment(false);
          alert("Failed to place order. Please try again.");
        }
      }, 2000);
    }
  };

  const handlePlaceOrder = () => {
    handleOpenModal();
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

  // Get card company logo path
  const getCardLogo = () => {
    switch (cardCompany) {
      case "VISA":
        return "data:image/png;base64,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";
      case "MasterCard":
        return "https://imageio.forbes.com/blogs-images/steveolenski/files/2016/07/Mastercard_new_logo-1200x865.jpg?format=jpg&height=600&width=1200&fit=bounds";
      case "American Express":
        return "data:image/png;base64,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";
      case "Discover":
        return "data:image/png;base64,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";
      case "JCB":
        return "data:image/png;base64,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";
      case "Diners Club":
        return "data:image/png;base64,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";
      case "UnionPay":
        return "data:image/png;base64,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"
      default:
        return null;
    }
  };

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
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
            {cart === "2" && (
      <TableCell align="center">
        <Typography variant="body2" sx={{ mb: 1 }}>
          Rate:
        </Typography>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              cursor: "pointer",
              color: star <= (productRatings[item.product._id] || 0) 
                ? "#FFD700" 
                : "#D3D3D3",
            }}
            onClick={() => handleRating(item.product._id, star)}
          >
            ★
          </span>
        ))}
      </TableCell>
    )}
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

      {/* Payment Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="payment-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "500px" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography id="payment-modal-title" variant="h6" component="h2">
              Payment Details
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Total Amount: <strong>${total.toFixed(2)}</strong>
            </Typography>
          </Box>

          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Select Payment Method
            </Typography>
            <RadioGroup
              aria-label="payment-method"
              name="payment-method"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <FormControlLabel
                    value="creditCard"
                    control={<Radio />}
                    label="Credit Card"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    value="debitCard"
                    control={<Radio />}
                    label="Debit Card"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    value="upi"
                    control={<Radio />}
                    label="UPI"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    value="cashOnDelivery"
                    control={<Radio />}
                    label="Cash on Delivery"
                  />
                </Grid>
              </Grid>
            </RadioGroup>
          </FormControl>

          {(paymentMethod === "creditCard" || paymentMethod === "debitCard") && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {paymentMethod === "creditCard" ? "Credit Card" : "Debit Card"} Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    variant="outlined"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    error={!!formErrors.cardNumber}
                    helperText={formErrors.cardNumber}
                    inputProps={{ maxLength: 19 }}
                    InputProps={{
                      endAdornment: cardCompany && (
                        <InputAdornment position="end">
                          {getCardLogo() ? (
                            <Box
                              component="img"
                              src={getCardLogo()}
                              alt={cardCompany}
                              sx={{ height: 24, maxWidth: 40 }}
                            />
                          ) : (
                            <Typography variant="body2" color="primary">
                              {cardCompany}
                            </Typography>
                          )}
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name on Card"
                    variant="outlined"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    error={!!formErrors.cardName}
                    helperText={formErrors.cardName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    variant="outlined"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    placeholder="MM/YY"
                    error={!!formErrors.expiryDate}
                    helperText={formErrors.expiryDate}
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    variant="outlined"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    type="password"
                    error={!!formErrors.cvv}
                    helperText={formErrors.cvv}
                    inputProps={{ maxLength: 4 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {paymentMethod === "upi" && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                UPI Details
              </Typography>
              <TextField
                fullWidth
                label="UPI ID"
                variant="outlined"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="example@upi"
                error={!!formErrors.upiId}
                helperText={formErrors.upiId}
              />
            </Box>
          )}

          {paymentMethod === "cashOnDelivery" && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                You will pay when your order is delivered. Additional charges may apply.
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              sx={{ mr: 2 }}
              disabled={processingPayment}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleProcessPayment}
              disabled={processingPayment}
              startIcon={processingPayment && <CircularProgress size={20} color="inherit" />}
            >
              {processingPayment ? "Processing..." : "Confirm Payment"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;