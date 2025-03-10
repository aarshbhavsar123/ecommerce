"use client";
import ProductCard from "@/components/Card";
import { 
  Box, Drawer, Typography, Slider, TextField, Checkbox, FormGroup, FormControlLabel,
  Select, MenuItem, Pagination 
} from "@mui/material";
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOrder, setSortOrder] = useState(""); // Sorting state

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; 

  const brands = ["Samsung", "Apple", "Xiaomi", "Nothing", "Nokia", "Oppo", "Vivo", "Realme"];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("/api/products/get-products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (e) {
        console.error(e);
      }
      setDrawerOpen(false);
    }
    fetchProducts();
  }, []);

  const applyFilters = async () => {
    try {
      const response = await axios.get(`/api/products/get-products`, {
        params: {
          min: priceRange[0],
          max: priceRange[1],
          selectedBrands: JSON.stringify(selectedBrands), 
          sortOrder
        },
      });
      setFilteredProducts(response.data);
      setCurrentPage(1); 
    } catch (e) {
      console.error(e);
    }
    setDrawerOpen(false);
  };

  // Handle sorting with backend API
  const handleSortChange = async (event:any) => {
    const order = event.target.value;
    setSortOrder(order);
    
    try {
      const response = await axios.get(`/api/products/get-products`, {

        params: { order,min:priceRange[0],max:priceRange[1],selectedBrands: JSON.stringify(selectedBrands) },
      });
      setFilteredProducts(response.data);
      setCurrentPage(1); 
    } catch (e) {
      console.error(e);
    }
  };

  // Handle brand selection
  const handleBrandChange = (brand:any) => {
    setSelectedBrands((prev:any) => prev.includes(brand) ? prev.filter((b:any) => b !== brand) : [...prev, brand]);
  };

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedBrands([]);
    setFilteredProducts(products);
    setCurrentPage(1);
    setDrawerOpen(false);
  };

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <Box>

      {/* 🔹 Filter & Sorting Options */}
      <Box display="flex" justifyContent="space-between" alignItems="center" px={4} py={2}>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center py-2 px-4 text-white font-bold rounded bg-gradient-to-r from-blue-600 to-purple-400 hover:from-blue-700 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:-translate-y-1 hover:shadow-lg"
        >
          <MenuIcon className="mr-2" /> Filters
        </button>

        {/* MUI Select Component for Sorting */}
        <Select
          value={sortOrder}
          displayEmpty
          onChange={handleSortChange}
          variant="outlined"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">Sort by</MenuItem>
          <MenuItem value="asc">A-Z</MenuItem>
          <MenuItem value="desc">Z-A</MenuItem>
        </Select>
      </Box>

      {/* 🔹 Filter Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter Products
          </Typography>

          {/* 🔹 Price Range */}
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
          </Box>

          {/* 🔹 Brand Selection */}
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

          {/* 🔹 Apply Filters Button */}
          <Box mt={4} display="flex" justifyContent="center" gap={2}>
            <Box className="w-1/2">
              <Button onClick={applyFilters}>
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* 🔹 Products Grid */}
      <Box display="flex" flexWrap="wrap" justifyContent="between" gap={4} padding={4}>
        {currentProducts.map((product, index) => (
          <ProductCard
            key={index}
            image={product.images?.[0] || "/default-image.jpg"}
            title={product.product_name}
            price={product.price}
            id={product._id}
          />
        ))}
      </Box>

      {/* 🔹 Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(filteredProducts.length / productsPerPage)}
          page={currentPage}
          onChange={(_, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>

    </Box>
  );
};

export default Cards;
