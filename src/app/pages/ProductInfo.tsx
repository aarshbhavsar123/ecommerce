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
} from "@mui/material";
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
    const [quantity, setQuantity] = useState(1);
    const { user } = useAppContext();

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
        fetchData();
    }, []);
    
    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleDecrease = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

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
        // Implement buy now functionality
        
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Grid container spacing={6} alignItems="center">
                <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center" sx={{ mt: -4 }}>
                    {product && product.images?.length > 0 && (
                        <Slider {...settings} style={{ width: "90%", maxWidth: "500px" }}>
                            {product.images.map((image, index) => (
                                <div key={index} style={{ display: "flex", justifyContent: "center" }}>
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
                    <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: { xs: "1.5rem", md: "2rem" } }} gutterBottom>
                        {product && product.product_name}
                    </Typography>

                    <Typography variant="h5" sx={{ fontSize: { xs: "1.5rem", md: "1.7rem" }, color: "primary" }} gutterBottom>
                        ${product && product.price}
                    </Typography>

                    <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                            <Rating value={4.5} readOnly />
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" color="textSecondary">(5.0)</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" color="primary" sx={{ textDecoration: "underline", cursor: "pointer" }}>
                                345 Reviews
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
                                    "&:hover": { backgroundColor: "#e68a00", borderColor: "#e68a00" },
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
                                sx={{ backgroundColor: "#ff9900", "&:hover": { backgroundColor: "#e68a00" } }}
                                disableRipple
                                onClick={handleBuyNow}
                            >
                                Buy Now
                            </Button>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="body1" color="textSecondary" paragraph sx={{ typography: { xs: "body2", md: "body1" }, fontSize: { xs: "0.9rem", md: "0.8rem" } }}>
                        {product && product.description}
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductInfo;
