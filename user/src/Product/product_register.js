import React, { useState } from "react";
import "./productform.css"; 
import { useServicesHook } from "../Hooks/serviceHooks";
import { useNavigate } from "react-router-dom";

const ProductForm = () => {
  const { addProduct } = useServicesHook(); 
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    catogeryName: "",
    productName: "",
    price: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Product Registered:", productData);
    
    try {
      const productPayload = {
        category: productData.catogeryName, 
        product: {
            name: productData.productName,
            price: parseFloat(productData.price), 
            description: productData.description,
            image: productData.image
        }
      };
      // Call the addProduct API
      await addProduct(productPayload);
      navigate("/view-products");
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="product-form-container">
      {/* Left Side - Image */}
      <div className="product-image">
        <img
          src="https://via.placeholder.com/400x400" // Placeholder image (replace with your image URL)
          alt="Product Preview"
        />
      </div>

      {/* Right Side - Form */}
      <div className="product-form">
        <h2>Register New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="catogeryName">Category Name:</label>
            <input
              type="text"
              id="catogeryName"
              name="catogeryName"
              value={productData.catogeryName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={productData.productName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit">Register Product</button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
