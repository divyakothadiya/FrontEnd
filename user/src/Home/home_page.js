import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get user profile data from local storage
    const userProfile = JSON.parse(localStorage.getItem("userDetails"));
    const is_profile_complete = JSON.parse(localStorage.getItem("is_profile_complete"));

    if (userProfile && is_profile_complete) {
      setWelcomeMessage(`Welcome to Customer page, ${userProfile.first_name} ${userProfile.last_name}!`);
    }
  }, []);

  return (
    <div>
    {/* Welcome Message */}
        <Box p={2}>
        <Typography variant="h4">{welcomeMessage}</Typography>
        <Typography variant="body1">This is the home page content.</Typography>
        </Box>
    </div>
  );
};

export default HomePage;
