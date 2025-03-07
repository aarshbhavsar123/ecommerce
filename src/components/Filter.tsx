"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Grid } from "@mui/material";
import ProductCard from "@/components/Card";
import Filters from "@/components/Filter";

type Product = {
  _id: string;
  product_name: string;
  brand: string;
  price: number;
  images?: string[];
};

const Cards: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("/api/products/get-products");
        setProducts(response.data);
        setFilteredProducts(response.data);

        const uniqueBrands = [...new Set(response.data.map((p: Product) => p.brand))];
        setBrands(uniqueBrands);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  const handleFilter = ({ brand, minPrice, maxPrice }: { brand: string; minPrice: string; maxPrice: string }) => {
    let filtered = products;

    if (brand) filtered = filtered.filter((p) => p.brand === brand);
    if (minPrice) filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice) filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));

    setFilteredProducts(filtered);
  };

  return (
    <Box padding={4}>
      <Grid container spacing={4}>
       
        <Grid item xs={12} sm={4} md={3}>
          <Filters brands={brands} onFilter={handleFilter} />
        </Grid>

        
        <Grid item xs={12} sm={8} md={9}>
          <Box display="flex" flexWrap="wrap" justifyContent="flex-start" gap={4}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                image={product.images?.[0] || "/default-image.jpg"}
                title={product.product_name}
                price={product.price}
                id={product._id}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cards;
