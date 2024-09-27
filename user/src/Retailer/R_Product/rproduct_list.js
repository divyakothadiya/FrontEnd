import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, IconButton, Button, Grid, Collapse } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useServicesHook } from "../../Hooks/serviceHooks";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const RProductList = () => {
  const { getProducts, deleteProduct } = useServicesHook();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response);
        const categoryList = Object.keys(response);
        setCategories(categoryList);
        if (categoryList.length > 0) {
          setSelectedCategory(categoryList[0]);
        }
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, [getProducts]);

  const addProduct = () => {
    navigate('/add-product', { state: { category: selectedCategory } });
  };

  const editProduct = (product) => {
    navigate('/add-product', { state: { category: selectedCategory, product, isEdit: true } });
  };

  const removeProduct = async (product) => {
    try {
      const payload = {
        category: selectedCategory,
        name: product.name
      }
      await deleteProduct(payload);
      setProducts((prevProducts) => {
        const updatedProducts = { ...prevProducts };
        if (updatedProducts[selectedCategory]) {
          updatedProducts[selectedCategory] = updatedProducts[selectedCategory].filter(item => item.name !== product.name);
          // if (updatedProducts[selectedCategory].length === 0) {
          //   delete updatedProducts[selectedCategory];
          // }
        }
        return updatedProducts;
      });
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedProductIndex(null);
  };

  const handleProductClick = (index) => {
    setSelectedProductIndex((prevIndex) => (prevIndex === index ? null : index));
    setCurrentImageIndex(0);
  };

  const handleDotHover = (e, index) => {
    e.stopPropagation(); 
    setCurrentImageIndex(index); 
  };

  // Function to render only product details without images
  const renderDetailsWithoutImages = (details) => {
    if (!details) return null;

    return Object.entries(details).map(([key, value], idx) => {
      if (key !== 'images') {  // Exclude images
        if (Array.isArray(value)) {
          return (
            <Box key={idx} sx={{ marginBottom: '10px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {key}:
              </Typography>
              <ul>
                {value.map((val, index) => (
                  <li key={index}>{val}</li>
                ))}
              </ul>
            </Box>
          );
        } else if (typeof value === 'string' || typeof value === 'number') {
          return (
            <Box key={idx} sx={{ marginBottom: '10px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {key}:
              </Typography>
              <Typography variant="body2">{value}</Typography>
            </Box>
          );
        }
      }
      return null;
    });
  };

  // Function to render images only
  const renderImages = (images) => {
    if (!images || !Array.isArray(images)) return null;

    return (
      <Box sx={{ marginBottom: '10px', textAlign: 'center' }}>
        {/* Image Carousel */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '400px', // Fixed height to keep the carousel consistent
            margin: '0 auto',
            overflow: 'hidden',
            borderRadius: '8px',
            display: 'flex', // To vertically center the image
            alignItems: 'center', // Center the image vertically
            justifyContent: 'center', // Center the image horizontally
          }}
        >
          <img
            src={`${images[currentImageIndex]}`}
            alt={`Product Image ${currentImageIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        </Box>

        {/* Dots for navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
          {images.map((_, index) => (
            <Box
              key={index}
              onMouseEnter={(e) => handleDotHover(e, index)}
              sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: currentImageIndex === index ? 'primary.main' : 'gray',
                margin: '0 5px',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
      </Box>
    );
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
            color="primary"
            onClick={() => handleCategoryClick(category)}
            sx={{
              marginBottom: '10px',
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
            <Box sx={{ paddingBottom: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {selectedCategory} Products
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={addProduct}
                sx={{
                  width: '5%',
                  height: '5%',
                  borderRadius: '50%',
                  backgroundColor: addProduct ? 'white' : 'transparent', // Background for clicked state
                  color: addProduct ? 'primary.main' : 'white', // Icon color for clicked state
                  border: '2px solid', // Border around the button
                  borderColor: 'primary.main', // Primary color for border
                  transition: 'background-color 0.3s ease, color 0.3s ease', // Smooth transition
                  '&:hover': {
                    backgroundColor: addProduct ? 'primary.main' : 'white', // Light hover background if not clicked
                    color: addProduct ? 'white' : 'primary.main', // Icon color for clicked state
                  },
                }}
              >
                <AddIcon />
              </Button>
            </Box>

            <Grid container direction="column" spacing={2}>
              {products[selectedCategory].map((product, index) => (
                product.name && (
                  <Grid item key={index}>
                    <Card
                      sx={{
                        padding: '10px',
                        cursor: 'pointer',
                        border: selectedProductIndex === index ? '2px solid' : '1px solid #ddd',
                      }}
                      onClick={() => handleProductClick(index)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircleIcon
                            sx={{
                              marginRight: '8px',
                              color: selectedProductIndex === index ? 'primary.main' : 'gray',
                            }}
                          />
                          {product.name}
                        </Typography>
                        <Box>
                          <IconButton 
                            aria-label="edit" 
                            onClick={() => editProduct(product)}
                            color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            aria-label="delete" 
                            onClick={() => removeProduct(product)}
                            color="secondary">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Product Details */}
                      <Collapse in={selectedProductIndex === index}>
                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                          {/* Conditionally Render Image Section (40%) */}
                          {product.details.images ? (
                            <Grid item xs={12} sm={4}>
                              {renderImages(product.details.images)}
                            </Grid>
                          ) : null}

                          {/* Conditionally Set Detail Section to 100% if no images */}
                          <Grid item xs={12} sm={product.details.images ? 8 : 12}>
                            <Box sx={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                              {renderDetailsWithoutImages(product.details)}
                            </Box>
                          </Grid>
                        </Grid>
                      </Collapse>
                    </Card>
                  </Grid>
                )
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RProductList;
