"use client";

import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  id: string;
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

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  id,
}) => {
  const router = useRouter();
  const handleClick = (id: string) => {
    router.push(`/product-overview/${id}`);
  };
  return (
    <Card
      sx={{
        width: 265,
        height: 400,
        borderRadius: 2,
        boxShadow: 5,
        transition: "0.3s",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": { boxShadow: 10 },
      }}
      onClick={() => handleClick(id)}
    >
      <CardMedia
        component="img"
        sx={{
          width: "100%",
          height: 180,
          objectFit: "contain",
          backgroundColor: "#f5f5f5",
        }}
        image={image}
        alt={title}
      />
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: "bold",
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          color="primary"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          ${price.toFixed(2)}
        </Typography>
        <Button onClick={() => handleClick(id)} />
      </CardContent>
    </Card>
  );
};

export default ProductCard;
