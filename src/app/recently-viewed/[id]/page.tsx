"use client";
import ProductCard from "@/components/Card";
import { Box, Pagination } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "@/context";
const Button: React.FC<{ onClick: () => void; children: React.ReactNode; variant?: 'primary' | 'outline' }> = ({ 
  onClick, 
  children, 
  variant = 'primary' 
}) => {
  return (
    
    <button
      onClick={onClick}
      className={`transition-all py-3 px-4 w-full font-bold rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:-translate-y-1 hover:shadow-lg ${
        variant === 'primary' 
          ? 'text-white bg-gradient-to-r from-blue-600 to-purple-400 hover:from-blue-700 hover:to-purple-500' 
          : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
      }`}
    >
      {children}
    </button>
  );
};

const Cards: React.FC = () => {
  const {user} = useAppContext();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [recommendedProducts,setRecommendedProducts] = useState([]);
  const productsPerPage = 10; 
  useEffect(() => {
    if (!user?.id) return; 
  
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/api/products/get-recent`, {
          params: { userId: user.id, currentPage }
        });
  
        setProducts(response.data.products);
        setTotalPages(Math.ceil(response.data.totalProducts / productsPerPage));
      } catch (e) {
        console.error(e);
      }
    };
  
    fetchProducts();
  }, [currentPage, user?.id]);  
   
  useEffect(()=>{
    if(!user?.id)
      return;
    const fetchSimilarProducts = async()=>{
      try
      {
        const response = await axios.get(`/api/products/get-similar`,{
          params:
          {
            userId:user.id
          }
        })
        setRecommendedProducts(response.data.products);

      }
      catch(e)
      {
        console.error(e);
      }
    }
    fetchSimilarProducts();
  },[currentPage, user?.id]);
  return (
    <div>
        <div className="mt-6 ml-8">
        <h2 className="text-2xl font-bold mb-6">Products viewed by you</h2>  
      </div>
        <Box>
          <Box display="flex" flexWrap="wrap" justifyContent="between" gap={2} padding={2}>
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
      
      </Box>
      <div className="mt-6 ml-8">
        <h2 className="text-2xl font-bold mb-6">You may also like</h2>  
      </div>
      <Box display="flex" flexWrap="wrap" justifyContent="between" gap={2} padding={2}>
          {recommendedProducts.map((product, index) => (
            <ProductCard
              key={index}
              image={product.images?.[0] || "/default-image.jpg"}
              title={product.product_name}
              price={product.price}
              id={product._id}
            />
          ))}
        </Box>
      
      
    
    
    </div>
    
  );
};

export default Cards;
