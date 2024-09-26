import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, IconButton, Button, Grid, Collapse } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useServicesHook } from "../../Hooks/serviceHooks";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const RProductList = () => {
  const { getProducts } = useServicesHook();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        //const data = await response.json();
        setProducts(response); // Setting the response object containing the categories
        const categoryList = Object.keys(response); // Extracting categories
        setCategories(categoryList);
        if (categoryList.length > 0) {
          setSelectedCategory(categoryList[0]); // Automatically select the first category
        }
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, [getProducts]);

  const addProduct = () => {
    console.log('Add Product');
    navigate('/add-product', { state: { category: selectedCategory } });
  };

  // Handler to select a category
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedProductIndex(null); // Reset product selection when the category changes
  };

  // Handler to toggle product details
  const handleProductClick = (index) => {
    setSelectedProductIndex((prevIndex) => (prevIndex === index ? null : index)); // Toggle product details
  };

  return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      {/* Vertical Category Bar */}
      <Box sx={{ width: '20%', paddingRight: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        {categories.map((category, index) => (
          <Button
            key={index}
            fullWidth
            variant={selectedCategory === category ? 'contained' : 'outlined'}
            color="primary" // Primary color for selected category
            onClick={() => handleCategoryClick(category)}
            sx={{
              marginBottom: '10px',
              borderColor: selectedCategory === category ? 'primary.main' : '#ddd',
              backgroundColor: selectedCategory === category ? 'primary.main' : 'transparent',
              color: selectedCategory === category ? 'white' : 'inherit',
              ':hover': {
                backgroundColor: selectedCategory === category ? 'primary.main' : '#f0f0f0', // Hover effect using primary color
              },
            }}
          >
            {category}
          </Button>
        ))}
      </Box>

      {/* Vertical Products List */}
      <Box sx={{ width: '80%' }}>
        {selectedCategory && products[selectedCategory] && (
          <Box>
            {/* Header with Add Product button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {selectedCategory} Products
              </Typography>
              <Button
                    variant="outlined"
                    color="primary"
                    onClick={addProduct}
                    sx={{
                        borderRadius: '50%',
                        width: 30,
                        height: 30,
                        minWidth: 30,
                        minHeight: 30,
                        padding: 0,
                        border: '2px solid',
                        borderColor: 'primary.main',
                        backgroundColor: 'transparent',
                        transition: 'border-color 0.3s, color 0.3s', // Smooth transition
                    
                        '&:hover': {
                          color: 'white',
                        },
                      }}
                >
                    <AddIcon />
                </Button>
            </Box>

            <Grid container direction="column" spacing={2}>
              {products[selectedCategory].map(
                (product, index) =>
                  product.name && (
                    <Grid item key={index}>
                      <Card
                        sx={{
                            padding: '10px',
                            cursor: 'pointer',
                            border: selectedProductIndex === index ? '2px solid' : '1px solid #ddd',
                            borderColor: selectedProductIndex === index ? 'primary.main' : '#ddd', // Use primary.main for selected product border color
                        }}
                        onClick={() => handleProductClick(index)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircleIcon 
                                sx={{ 
                                    marginRight: '8px', 
                                    color: selectedProductIndex === index ? 'primary.main' : 'gray',  
                                    fontSize: '24px',
                                    transform: selectedProductIndex === index ? 'scale(1.1)' : 'scale(1)',  // Slightly enlarge when selected
                                    transition: 'color 0.3s ease-in-out, transform 0.3s ease-in-out', // Smooth transition for color and scale
                                }} 
                          />
                            {product.name}
                          </Typography>
                          <Box>
                            <IconButton aria-label="edit" color="primary">
                              <EditIcon />
                            </IconButton>
                            <IconButton aria-label="delete" color="secondary">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* Product Details */}
                        <Collapse in={selectedProductIndex === index}>
                          <Box
                            sx={{
                              marginTop: '10px',
                              backgroundColor: '#f5f5f5',
                              padding: '10px',
                              borderRadius: '5px',
                            }}
                          >
                            <Typography variant="body2">
                              Price: ₹{product.details?.price ?? 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                              {Array.isArray(product.details?.features) &&
                                product.details.features.map((feature, idx) => (
                                  <li key={idx}>{feature}</li>
                                ))}
                            </Typography>
                          </Box>
                        </Collapse>
                      </Card>
                    </Grid>
                  )
              )}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RProductList;
