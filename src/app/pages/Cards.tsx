import ProductCard from "@/components/Card";
import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";

const Cards = ()=>{
    const products = [
        { image: "https://via.placeholder.com/200", title: "Wireless Headphones", price: 49.99 },
        { image: "https://via.placeholder.com/200", title: "Smart Watch", price: 79.99 },
        { image: "https://via.placeholder.com/200", title: "Bluetooth Speaker", price: 39.99 },
        { image: "https://via.placeholder.com/200", title: "Gaming Mouse", price: 29.99 },
      ];
    
      return (
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3} padding={3}>
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </Box>
      );
}
export default Cards