"use client";
import ProductCard from "@/components/Card";
import { Box, Drawer, Typography, Slider, TextField, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import MenuIcon from '@mui/icons-material/Menu';

// Custom Button component
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
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const f = async()=>{
        try{
          const response = await axios.get(`/api/products/get-products?min=${priceRange[0]}&max=${priceRange[1]}`);
          setFilteredProducts(response.data);
        }
        catch(e)
        {
          console.error(e);
        }
  
      }
      f();
      setDrawerOpen(false);
    }

    fetchProducts();
  }, []);

  // Apply filters function
  const applyFilters = () => {
    
    const f = async()=>{
      try{
        const response = await axios.get(`/api/products/get-products?min=${priceRange[0]}&max=${priceRange[1]}`);
        setFilteredProducts(response.data);
        alert("Filtered Successfully");
      }
      catch(e)
      {
        console.error(e);
      }

    }
    f();
    setDrawerOpen(false);
  };

  // Handle brand selection
  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedBrands([]);
    setFilteredProducts(products);
    setDrawerOpen(false);
  };

  // Handle card click
  const handleCardClick = (product:any) => {
    console.log(product);
  };

  return (
    <Box>
      {/* Filter Button with Hamburger Icon */}
      <Box display="flex" justifyContent="flex-start" px={4} py={2}>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center py-2 px-4 text-white font-bold rounded bg-gradient-to-r from-blue-600 to-purple-400 hover:from-blue-700 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:-translate-y-1 hover:shadow-lg"
        >
          <MenuIcon className="mr-2" /> Filters
        </button>
      </Box>

      {/* Filter Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 300, padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter Products
          </Typography>
          
          {/* Price Range Filter */}
          <Box mt={3}>
            <Typography id="price-range-slider" gutterBottom>
              Price Range
            </Typography>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
              aria-labelledby="price-range-slider"
            />
            <Box display="flex" justifyContent="space-between" mt={2}>
              <TextField
                label="Min"
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
              />
              <TextField
                label="Max"
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
          </Box>
          
          {/* Brand Filter */}
          <Box mt={4}>
            <Typography gutterBottom>Brands</Typography>
            <FormGroup>
              {brands.map(brand => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox 
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                  }
                  label={brand}
                />
              ))}
            </FormGroup>
          </Box>
          
          {/* Action Buttons */}
          <Box mt={4} display="flex" justifyContent="space-between" gap={2}>
            <Box className="w-1/2">
              <Button onClick={resetFilters} variant="outline">
                Reset
              </Button>
            </Box>
            <Box className="w-1/2">
              <Button onClick={applyFilters}>
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Products Grid */}
      <Box display="flex" flexWrap="wrap" justifyContent="between" gap={4} padding={4}>
        {filteredProducts.map((product, index) => (
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
  );
};

export default Cards;
