"use client";

import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
}

const Button: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mt-4 transition-all block py-3 px-4 w-full text-white font-bold rounded bg-gradient-to-r from-blue-600 to-purple-400 hover:from-blue-700 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:-translate-y-1 hover:shadow-lg"
    >
      Buy Now
    </button>
  );
};

const handleClick = () => {
  alert("Item added to cart!");
};

const ProductCard: React.FC<ProductCardProps> = ({ image, title, price }) => {
  return (
    <Card sx={{ maxWidth: 265.4499876 , borderRadius: 2, boxShadow: 5, transition: "0.3s", '&:hover': { boxShadow: 10 } }}>
      <CardMedia component="img" height="200" image={image} alt={title} sx={{ objectFit:"fill"}} />
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight:"bold" }}>
          {title}
        </Typography>
        <Typography variant="h5" color="primary" sx={{ fontWeight: "bold", mb: 1 }}>
          ${price.toFixed(2)}
        </Typography>
        <Button onClick={handleClick} />
      </CardContent>
    </Card>
  );
};

export default ProductCard