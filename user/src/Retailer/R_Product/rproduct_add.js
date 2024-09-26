import React, { useState, useCallback } from 'react';
import { Typography, TextField, Button, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useLocation, useNavigate } from 'react-router-dom';
import { useServicesHook } from '../../Hooks/serviceHooks';

const AddProductPage = () => {
  const { addProduct } = useServicesHook();  
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = location.state || {};
  const [productName, setProductName] = useState('');
  const [customFields, setCustomFields] = useState([{ key: '', value: '' }]);
  const [images, setImages] = useState([]);
  const [payload, setPayload] = useState([]);

  const addCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };

  const handleCustomFieldChange = (index, field, value) => {
    const newFields = [...customFields];
    newFields[index][field] = value;
    setCustomFields(newFields);
  };

  const removeCustomField = (index) => {
    const newFields = customFields.filter((_, idx) => idx !== index);
    setCustomFields(newFields);
  };

  // Handler to handle image uploads and convert them to Base64
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const base64Promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject; 
        reader.readAsDataURL(file);
      });
    });

    Promise.all(base64Promises)
      .then((base64Images) => {
        setImages((prevImages) => [...prevImages, ...base64Images]);
        console.log("Images uploaded:", [...images, ...base64Images]); 
      })
      .catch((error) => {
        console.error("Error reading images", error);
      });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, idx) => idx !== index);
    setImages(newImages);
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault(); // Prevent default form submission

      try {
          const newPayload = {
            category: category,
            product: {
              name: productName,
              images: [...images], // Assuming 'images' is already a base64 string array
            },
          };
      
          customFields.forEach((field) => {
            if (field.key && field.value) {
                newPayload.product[field.key] = field.value;
            }
          });
          setPayload(newPayload);
      
          console.log(JSON.stringify(payload, null, 2));
          await addProduct(newPayload);
          navigate('/product-list'); // Adjust the route accordingly
      } catch (e) {
        console.error("Error submitting update user form:", e);
      }
    },
    [addProduct, payload, images,customFields, navigate]
  );

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px' }}>
        Add Product
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          label="Category"
          value={category || ''}
          disabled
          style={{ marginBottom: '20px' }}
        />
        
        <TextField
          fullWidth
          variant="outlined"
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={{ marginBottom: '20px' }}
        />

        {customFields.map((field, index) => (
          <Grid container spacing={2} key={index} alignItems="center">
            <Grid item xs={5}>
              <TextField
                fullWidth
                variant="outlined"
                label="Custom Field Key"
                value={field.key}
                onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)}
                style={{ marginBottom: '20px' }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                variant="outlined"
                label="Custom Field Value"
                value={field.value}
                onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                style={{ marginBottom: '20px' }}
              />
            </Grid>
            <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                aria-label="delete" 
                onClick={() => removeCustomField(index)} 
                color="secondary"
              >
                <DeleteIcon />
              </IconButton>
              
              {index === customFields.length - 1 && (
                <IconButton 
                  aria-label="add" 
                  onClick={addCustomField} 
                  color="primary" 
                >
                  <AddIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}

        
        {customFields.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <IconButton 
              aria-label="add" 
              onClick={addCustomField} 
              color="primary" 
            >
              <AddIcon />
            </IconButton>
          </div>
        )}

        <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '10px', textAlign: 'center' }}>
          Upload Product Images
        </Typography>

        <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block', textAlign: 'center', marginBottom: '20px' }}>
          <Button variant="outlined" component="span" color="primary">
            Choose Images
          </Button>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </label>

        <Grid container spacing={2} justifyContent="center">
          {images.map((image, index) => (
            <Grid item xs={3} key={index}>
              <div style={{
                position: 'relative',
                width: '100%',
                height: '150px', 
                overflow: 'hidden', 
                borderRadius: '4px', 
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)', 
                transition: 'transform 0.2s', 
              }}>
                <img 
                  src={image} 
                  alt={`product-preview-${index}`} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    borderRadius: '4px' 
                  }}
                />
                <IconButton 
                  aria-label="delete" 
                  onClick={() => removeImage(index)} 
                  color="secondary"
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f44336'; }} 
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }} 
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </Grid>
          ))}
        </Grid>

        {/* Centered Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button variant="contained" color="primary" type="submit">
            Submit Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage
