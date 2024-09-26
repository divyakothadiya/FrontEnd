import React, { useState } from "react";
import { AppBar, Toolbar, Button, Box, Tabs, Tab, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  // Determine which tab is active based on the current route
  const getCurrentTab = () => {
    switch (location.pathname) {
      case "/home":
        return 0;
      case "/view-products":
        return 1;
      default:
        return false; // None of the tabs is selected
    }
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  // Handler for switching between tabs
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      navigate("/home");
    } else if (newValue === 1) {
      navigate("/view-products");
    }
  };

  // Handle Profile button click to open dropdown
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu item clicks
  const handleMenuItemClick = (action) => {
    setAnchorEl(null);
    if (action === "viewProfile") {
      navigate("/profile");
    } else if (action === "logout") {
      handleLogout();
    }
    else if (action === "addProduct") {
      navigate("/add-product");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Close the dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              TabIndicatorProps={{ style: { backgroundColor: '#FFA726' } }} // Set indicator color to warning
              textColor="inherit" // Ensure the text color is controlled
            >
              <Tab 
                label="Home" 
                sx={{
                  color: activeTab === 0 ? '#FFA726' : 'white',  // Warning color when active, white otherwise
                  fontWeight: activeTab === 0 ? 'bold' : 'normal', // Make the active tab text bold
                  '&:hover': {
                    color: '#FF9800', // Slightly different warning color on hover
                    backgroundColor: 'rgba(255, 152, 0, 0.1)', // Subtle hover effect
                  },
                }}
              />
              <Tab 
                label="Products" 
                sx={{
                  color: activeTab === 1 ? '#FFA726' : 'white',  // Warning color when active
                  fontWeight: activeTab === 1 ? 'bold' : 'normal', // Make the active tab text bold
                  '&:hover': {
                    color: '#FF9800',  // Slightly different warning color on hover
                    backgroundColor: 'rgba(255, 152, 0, 0.1)', // Subtle hover effect
                  },
                }}
              />
            </Tabs>
          </Box>
          <Button
            onClick={handleProfileClick}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: 'transparent', 
              color: 'white', 
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } // Optional hover effect
            }}
          >
            <AccountCircleIcon />
            <Typography variant="body1" sx={{ marginLeft: 1 }}>
              Profile
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuItemClick("viewProfile")}>View Profile</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("addProduct")}>Add Product</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("logout")}>Logout</MenuItem>
      </Menu>

      {/* Render the current page's content */}
      <Outlet />
    </div>
  );
};

export default NavigationBar;
