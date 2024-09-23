import React from "react";
import { AppBar, Toolbar, Button, Box, Tabs, Tab } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();

  // Handler for switching between tabs
  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate("/home");
    } else if (newValue === 1) {
      navigate("/products");
    }
  };

  // Handle Profile button click
  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Tabs value={false} onChange={handleTabChange}>
              <Tab label="Home" />
              <Tab label="Products" />
            </Tabs>
          </Box>
          <Button color="inherit" onClick={handleProfileClick}>
            Profile
          </Button>
        </Toolbar>
      </AppBar>

      {/* Render the current page's content */}
      <Outlet />
    </div>
  );
};

export default NavigationBar;
