import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  LinearProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useServicesHook } from "../Hooks/serviceHooks";

const LogInAndSignUp = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    address: "",
    phone_number: "",
    showPassword: false,
    tc: true
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
      try {
        if (!isSignup) {
          const { email, password } = formData;
          const loginData = { email, password };
          console.log("user logged in:", loginData);
          const response = await loginUser(loginData);
          
          if (response.isProfileComplete) {
            console.log("user logged in profile complete:", response.isProfileComplete);
            alert("profile completed")
          } else {
            console.log("user logged in profile not complete:", response.isProfileComplete);
            navigate("/profile");
          }
        } else {
          console.log("user signed up:", formData);
          await createUser(formData);
          window.location.reload();
        }
      } catch (e) {
        console.log(e);
      }
    },
    [createUser, loginUser, navigate, formData, isSignup]
  );

  const resetState = () => {
    setIsSignup(!isSignup);
    setFormData({
      username: "",
      email: "",
      password: "",
      password2: "",
      address: "",
      phone_number: "",
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
            onClick={resetState}
            sx={{ marginTop: 3, borderRadius: 3 }}
          >
            User {isSignup ? "LogIn" : "Register"}{" "}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default LogInAndSignUp;