import ProductCard from "@/components/Card";
import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";

const Cards: React.FC = () => {
  const products = [
    { image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600", title: "Wireless Headphones", price: 49.99 },
    { image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600", title: "Wireless Headphones", price: 49.99 },
    { image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600", title: "Wireless Headphones", price: 49.99 },
    { image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600", title: "Wireless Headphones", price: 49.99 },
    { image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600", title: "Wireless Headphones", price: 49.99 },
    { image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600", title: "Wireless Headphones", price: 49.99 },
    { image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600", title: "Wireless Headphones", price: 49.99 },
    { image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600", title: "Wireless Headphones", price: 49.99 },
    { image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600", title: "Wireless Headphones", price: 49.99 },
    { image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600", title: "Wireless Headphones", price: 49.99 },
    { image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600", title: "Wireless Headphones", price: 49.99 },
    { image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600", title: "Wireless Headphones", price: 49.99 },
    
    
  ];

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="between" gap={4} padding={4}>
      {products.map((product, index) => (
        <ProductCard key={index} {...product} />
      ))}
    </Box>
  );
};

export default Cards;