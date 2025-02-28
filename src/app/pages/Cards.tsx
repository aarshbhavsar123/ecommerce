"use client";
import ProductCard from "@/components/Card";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const Cards: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("/api/products/get-products");
        console.log(response.data);
        
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="between"
      gap={4}
      padding={4}
    >
      {products.map((product, index) => (
        <ProductCard
          key={index}
          image={product.images?.[0] || "/default-image.jpg"}
          title={product.product_name}
          price={product.price}
          id={product._id}
        />
      ))}
    </Box>
  );
};

export default Cards;
