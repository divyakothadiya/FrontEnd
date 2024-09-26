import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  LinearProgress,
  InputAdornment,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useServicesHook } from "../Hooks/serviceHooks";
import SignupPopup from "./signup_popup";

const LogInAndSignUp = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isSignupR, setIsSignupR] = useState(false);
  const [showPopup, setShowPopup] = useState(false);  
  const [userType, setUserType] = useState("is_customer"); 
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    address: "",
    phone_number: "",
    gst_no: "",
    organization: "",
    showPassword: false,
    tc: true,
  });
  const { createUser, loginUser } = useServicesHook();
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    // Other fields if needed
  });
  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e) => {

    if (!touched[e.target.name]) {
      setTouched((prevTouched) => ({ ...prevTouched, [e.target.name]: true }));
    }

    // Handle email validation as the user types
    if (e.target.name === "email") {
      if (touched.email && !emailRegex.test(e.target.value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Invalid email domain. Accepted domains are yahoo, gmail, microsoft, etc and TLDs such as .com, .co, .uk, .in, etc",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
      }
    }

    if (e.target.name === "password") {
      const strength = calculatePasswordStrength(e.target.value);
      setPasswordStrength(strength);
      validatePassword(e.target.value);
    }
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle radio button changes for user type selection
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  // State for handling which checkboxes are checked
  const [signupType, setSignupType] = useState({ is_customer: false, is_retailer: false });

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setSignupType({ ...signupType, [e.target.name]: e.target.checked });
  };

  const handleToggleToLogin = () => {
    setIsSignup(false);  // Directly switch to the login form
    setShowPopup(false); // Make sure the popup is closed
  };

  // Show popup when the user clicks "Sign Up"
  const handleSignupClick = (event) => {
    event.preventDefault();
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // Check if any checkbox is selected
    if (signupType.is_customer || signupType.is_retailer) {
      setIsSignup(true); // Show the signup form if any checkbox is checked
    } else {
      setIsSignup(false); // Show the login form if no checkboxes are checked
    }
    // Logic to open appropriate form based on signupType
    if (signupType.is_customer && signupType.is_retailer) {
      // Show both customer and retailer fields
      setIsSignupR(true);
    } else if (signupType.is_retailer) {
      setIsSignupR(true);
    } else {
      setIsSignupR(false);
    }
  };


  const handleShowPassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const validatePassword = (password) => {
    if (password.length === 0) {
      setErrors({});
    } else if (password.length < 8) {
      setErrors({ password: "Password should be at least 8 characters" });
    } else if (passwordStrength < 4) {
      setErrors({
        password:
          "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    } else {
      setErrors({});
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (showPopup) {
        return;  // Do not submit if the popup is still open
      }
      try {
        if (!isSignup) {
          const { email, password } = formData;
          const loginData = { 
            email, 
            password ,
            [userType]: true,
          };
          console.log("user logged in:", loginData);
          const response = await loginUser(loginData);
          
          if (response.isProfileComplete) {
            console.log("user logged in profile complete:", response.isProfileComplete);
            navigate("/home");
          } else {
            console.log("user logged in profile not complete:", response.isProfileComplete);
            navigate("/profile");
          }
        } else {
          let payload = {
              username: formData.username,
              email: formData.email,
              password: formData.password,
              password2: formData.password2,
              address: formData.address,
              phone_number: formData.phone_number,
          };
          if (signupType.is_customer) {
            payload.is_customer = true;
          }
          if (signupType.is_retailer) {
            payload.is_retailer = true;
            payload.retailer = {
              gst_no: formData.gst_no,
              organization: formData.organization,
            };
          }
          if (signupType.is_retailer && signupType.is_customer) {
            payload.is_customer = true;
            payload.is_retailer = true;
            payload.retailer = {
              gst_no: formData.gst_no,
              organization: formData.organization,
            };
          }
          console.log("user signed up:", payload);
          await createUser(payload);
          window.location.reload();
        }
      } catch (e) {
        console.log(e);
      }
    },
    [createUser, loginUser, navigate, formData, isSignup, userType, isSignupR]
  );

  const resetState = () => {
    setIsSignup(!isSignup);
    setIsSignupR(false);
    setFormData({
      username: "",
      email: "",
      password: "",
      password2: "",
      address: "",
      phone_number: "",
      gst_no:"",
      organization:"",
      showPassword: false,
      tc: true
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection={"column"}
          maxWidth={400}
          alignItems="center"
          justifyContent={"center"}
          margin="auto"
          marginTop={5}
          padding={3}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
          sx={{ ":hover": { boxShadow: "10px 10px 20px #ccc" } }}
        >
          <Typography variant="h2" padding={3} textAlign="center">
            {isSignup ? "Create User" : "LogIn User"}
          </Typography>
          {!isSignup && (
            <RadioGroup
              row
              aria-label="userType"
              name="userType"
              value={userType}
              onChange={handleUserTypeChange}
            >
              <FormControlLabel
                value="is_customer"
                control={<Radio sx={{ color: "#ff9800", '&.Mui-checked': { color: '#ff9800' } }} />} // Custom color
                label="Customer"
              />
              <FormControlLabel
                value="is_retailer"
                control={<Radio sx={{ color: "#ff9800", '&.Mui-checked': { color: '#ff9800' } }} />} // Custom color
                label="Retailer"
              />
            </RadioGroup>
          )}

          {isSignup && (
            <>
              <TextField
                fullWidth
                onChange={handleChange}
                name="username"
                value={formData.username}
                margin="normal"
                type={"text"}
                variant="outlined"
                label="Name"
                error={!!errors.username}
                helperText={errors.username}
              />
              <TextField
                fullWidth
                onChange={handleChange}
                name="address"
                value={formData.address}
                margin="normal"
                type={"text"}
                variant="outlined"
                label="Address"
                error={!!errors.address}
                helperText={errors.address}
              />
              <TextField
                fullWidth
                onChange={handleChange}
                name="phone_number"
                value={formData.phone_number}
                margin="normal"
                type={"text"}
                variant="outlined"
                label="Contact No"
                error={!!errors.phone_number}
                helperText={errors.phone_number}
              />
              {isSignupR && (
                <>
                <TextField
                  fullWidth
                  onChange={handleChange}
                  name="gst_no"
                  value={formData.gst_no}
                  margin="normal"
                  type={"text"}
                  variant="outlined"
                  label="GST No"
                  error={!!errors.gst_no}
                  helperText={errors.gst_no}
                />
                <TextField
                  fullWidth
                  onChange={handleChange}
                  name="organization"
                  value={formData.organization}
                  margin="normal"
                  type={"text"}
                  variant="outlined"
                  label="Organization"
                  error={!!errors.organization}
                  helperText={errors.organization}
                />
                </>
              )}
            </>
          )}

          <TextField
            fullWidth
            onChange={handleChange}
            name="email"
            value={formData.email}
            margin="normal"
            type={"email"}
            variant="outlined"
            label="Email"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type={formData.showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {formData.showPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {formData.password && (
            <Box>
              <Typography variant="caption">Password Strength</Typography>
              <LinearProgress
                variant="determinate"
                value={(passwordStrength / 4) * 100}
                sx={{ backgroundColor: '#ff9800' }}
              />
            </Box>
          )}

          {isSignup && (
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type={formData.showPassword ? "text" : "password"}
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              error={!!errors.password2}
              helperText={errors.password2}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      {formData.showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Button
            endIcon={
              isSignup ? <HowToRegOutlinedIcon /> : <LoginOutlinedIcon />
            }
            type="submit"
            sx={{ marginTop: 3, borderRadius: 3 }}
            variant="contained"
            color="warning"
          >
            {isSignup ? "SignUp" : "LogIn"}
          </Button>
          <Button
            endIcon={
              isSignup ? <LoginOutlinedIcon /> : <HowToRegOutlinedIcon />
            }
            onClick={isSignup ? handleToggleToLogin : handleSignupClick}
            sx={{ marginTop: 3, borderRadius: 3 }}
            variant="contained" // Make it contained for a similar look
            color="warning" // Apply the same warning color for uniformity
          >
            {isSignup ? "Already have an account? Log In" : "New User? Sign Up"}
          </Button>
        </Box>
      </form>
      <SignupPopup 
        open={showPopup} 
        handleClose={handleClosePopup} 
        handleCheckboxChange={handleCheckboxChange} 
        signupType={signupType}
      />
    </div>
  );
};

export default LogInAndSignUp;