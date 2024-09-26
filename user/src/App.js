import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogInAndSignUp from './LoginAndSignUp/login_signup';
import UserComponent from './profile/component_profile';
import { ReadOnlyDetails } from './profile/read_profile';
import HomePage from './Home/home_page';
import NavigationBar from './Home/navigationbar';
import ProductForm from './Product/product_register';
import ProductList from './Product/product_list';
import RHomePage from './Retailer/R_Home/r_homepage';
import RProductList from './Retailer/R_Product/rproduct_list';
import AddProductPage from './Retailer/R_Product/rproduct_add';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/"  element={<LogInAndSignUp/>} />
        <Route element={<NavigationBar />}>    
            <Route exact path="/profile"  element={<UserComponent/>} />
            <Route exact path="/read"  element={<ReadOnlyDetails/>} />
            <Route exact path="/home"  element={<HomePage/>} />
            <Route exact path="/r-home"  element={<RHomePage/>} />
            <Route exact path="/add-product"  element={<AddProductPage/>} />
            <Route exact path="/rview-product"  element={<RProductList/>} />
            <Route exact path="/add-product"  element={<RProductList/>} />            
            <Route exact path="/view-products"  element={<ProductList/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
