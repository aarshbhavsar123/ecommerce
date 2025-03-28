"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  Divider,
  IconButton,
  TextField,
  Box,
  Modal,
  FormGroup,
  FormControlLabel,
  Radio,
  TextareaAutosize
} from "@mui/material";
import { useRouter } from "next/navigation";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useAppContext } from "@/context";
import { setSelectedAddressIndex } from "@/redux/slices/authSlices";
import { useDispatch, useSelector } from "react-redux";
import { setQuantityRed } from "@/redux/slices/authSlices"; 
const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowBackIos
      className={className}
      style={{ ...style, display: "block", color: "black", zIndex: 2 }}
      onClick={onClick}
    />
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowForwardIos
      className={className}
      style={{ ...style, display: "block", color: "black", zIndex: 2 }}
      onClick={onClick}
    />
  );
};

const ProductInfo = () => {
  const [product, setProduct] = useState(null);
  const [address, setAddress] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modal1Open,setModal1Open] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [overallRating,setOverallRating] = useState(0);
  const [noOfReviews,setNoOfReviews] = useState(0);
  const { user } = useAppContext();
  const selectedAddressIndex = useSelector(
    (state: any) => state.auth.selectedAddressIndex
  );
  const quantityRed = useSelector((state: any) => state.auth.quantityRed);
  const [quantity, setQuantity] = useState<number>(quantityRed || 1);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSelectAddress = (index: any) => {
    const selectedAddress = addresses[index];
    console.log(selectedAddress);
    localStorage.setItem("address",JSON.stringify(selectedAddress));
    dispatch(setSelectedAddressIndex(index));
  };
  const proceed = async () => {
    try {
      const response = await axios.get(`/api/users/get-addresses/${user.id}`);
      localStorage.setItem("quantity",JSON.stringify(quantity));
      setAddresses(response.data || []);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== "undefined") {
        const pathParts = window.location.pathname.split("/");
        const id = pathParts[pathParts.length - 1];
        try {
          const response = await axios.get(`/api/products/get-product/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };
  
    const addRecent = async () => {
      if (typeof window !== "undefined") {
        const pathParts = window.location.pathname.split("/");
        const id = pathParts[pathParts.length - 1];
  
        try {
          if (!user || !user.id) return; 
  
          await axios.post(`/api/products/add-recent`, {
            productId: id,
            userId: user.id,
          });
        } catch (e) {
          console.log(e);
        }
      }
    };
  
    fetchData();
    addRecent();
    
    
  }, []); 
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

      alert("Successfully added the address");
    } catch (error) {
      console.error("Error saving address:", error);
      alert("An error occurred while saving the address.");
    }
  };
  useEffect(() => {
    const fetchRatings = async () => {
      const pathParts = window.location.pathname.split("/");
      const productId = pathParts[pathParts.length - 1];
  
      try {
        const response = await axios.get("/api/ratings/get-overall-ratings", {
          params: { productId }
        });
        console.log(response.data.length);
        setOverallRating(response.data.avg); 
        setNoOfReviews(response.data.length);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };
  
    fetchRatings();
  }, [product]);
  

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
    dispatch(setQuantityRed(quantity + 1));
};  

const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    dispatch(setQuantityRed(quantity > 1 ? quantity - 1 : 1));
};
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleOpenModal1 = () => setModal1Open(true);
  const handleCloseModal1 = () => setModal1Open(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    adaptiveHeight: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };
  useEffect(()=>{
    dispatch(setQuantityRed(1));
  },[]);
  const handleAddToCart = async () => {
    try {
      if (!user || !user.id) {
        alert("User not logged in!");
        return;
      }
      if (!product || !product._id) {
        alert("Product data not loaded yet!");
        return;
      }

      const obj = { userId: user.id, quantity, product_id: product._id };
      await axios.post("/api/cart/add-to-cart", obj);
      alert(`Added ${quantity} items of this product to the cart successfully`);
      setQuantity(1);
      
    } catch (e) {
      console.error("Error adding to cart:", e);
    }
  };
  

  const handleBuyNow = async () => {
    proceed();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: -4 }}
        >
          {product && product.images?.length > 0 && (
            <Slider {...settings} style={{ width: "90%", maxWidth: "500px" }}>
              {product.images.map((image, index) => (
                <div
                  key={index}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    style={{
                      width: "100%",
                      maxWidth: "500px",
                      height: "auto",
                      maxHeight: "600px",
                      objectFit: "contain",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              ))}
            </Slider>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", fontSize: { xs: "1.5rem", md: "1.6rem" } }}
            gutterBottom
          >
            {product && product.product_name}
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "1.3rem", md: "1.4rem" }, color: "primary" }}
            gutterBottom
          >
            ${product && product.price}
          </Typography>

          <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Rating value={overallRating} readOnly precision={0.01} />
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    ({overallRating.toFixed(2)})
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    {noOfReviews} Reviews
                  </Typography>
                </Grid>
              </Grid>


          <Grid container alignItems="center" spacing={2} sx={{ mt: 3 }}>
            <Grid item>
              <IconButton disableRipple onClick={handleDecrease}>
                <RemoveIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <TextField
                value={quantity}
                inputProps={{ style: { textAlign: "center", width: 50 } }}
                size="small"
              />
            </Grid>
            <Grid item>
              <IconButton disableRipple onClick={handleIncrease}>
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ShoppingCartIcon />}
                sx={{
                  color: "#fff",
                  backgroundColor: "#ff9900",
                  borderColor: "#ff9900",
                  "&:hover": {
                    backgroundColor: "#e68a00",
                    borderColor: "#e68a00",
                  },
                }}
                disableRipple
                onClick={handleAddToCart}
              >
                Add To Cart
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<LocalMallIcon />}
                sx={{
                  backgroundColor: "#ff9900",
                  "&:hover": { backgroundColor: "#e68a00" },
                }}
                disableRipple
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography
            variant="body1"
            color="textSecondary"
            paragraph
            sx={{
              typography: { xs: "body2", md: "body1" },
              fontSize: { xs: "0.7rem", md: "0.75rem" },
            }}
          >
            {product && product.description}
          </Typography>
        </Grid>
      </Grid>
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
          {addresses.length>0 ? <Typography id="modal-title" variant="h6" sx={{ mb: 2 }}>
            Select Your Address
          </Typography>:
          <Typography id="modal-title" variant="h6" sx={{ mb: 2 }}>
          Add Your Address
        </Typography>
          }
          
          <FormGroup>
            {addresses.map((address, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Radio
                    checked={selectedAddressIndex === index}
                    onChange={() => handleSelectAddress(index)} 
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
            {addresses.length>0 ? <Button
              variant="contained"
              color="primary"
              onClick={() =>
                router.push(`/order-summary?cart=0&product_id=${product._id}`)
              }
            >
              
              Confirm Address
            </Button>:<Button
              variant="contained"
              color="primary"
              onClick={() =>
                handleOpenModal1()
              }
            >
              
              Add Address
            </Button>}
            
          </Box>
        </Box>
      </Modal>
      <Modal open={modal1Open} onClose={handleCloseModal1}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 400,
                      bgcolor: "background.paper",
                      boxShadow: 24,
                      p: 4,
                      borderRadius: "4px",
                      position: "relative",
                    }}
                  >
                    <Button
                      onClick={handleCloseModal1}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        minWidth: "auto",
                        p: 1,
                        color: "grey.700",
                        '&:hover': {
                          bgcolor: "grey.200",
                          color: "grey.900",
                        },
                        zIndex: 1,
                      }}
                      aria-label="Close modal"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 6L6 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6 6L18 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
      
                    <Typography variant="h6" sx={{ mb: 2, pr: 4 }}>
                      Add Your Address
                    </Typography>
      
                    <TextareaAutosize
                      minRows={4}
                      placeholder="Enter your full address here..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{
                        width: "100%",
                        marginTop: "16px",
                        padding: "8px",
                        fontSize: "14px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
      
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                      <Button onClick={handleCloseModal1} sx={{ mr: 1 }}>
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveAddress}
                      >
                        Save Address
                      </Button>
                    </Box>
                  </Box>
                </Modal>
    </Container>
  );
};

export default ProductInfo;
