import React, { useState, useCallback } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import { useServicesHook } from "../Hooks/serviceHooks";

const VerifyUser = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { verifyUser } = useServicesHook();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { email, otp } = formData;
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!otp) newErrors.otp = "OTP is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!validateForm()) return;

      try {
        console.log("Verifying user:", formData);
        await verifyUser(formData);
        setFormData({ email: "", otp: "" });
        setErrors({});
        navigate("/homepage");
      } catch (e) {
        console.error("Verification failed:", e);
        setErrors({ submit: "Verification failed. Please try again." });
      }
    },
    [verifyUser, formData, navigate]
  );

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        maxWidth={400}
        alignItems="center"
        justifyContent="center"
        margin="auto"
        marginTop={5}
        padding={3}
        borderRadius={5}
        boxShadow="5px 5px 10px #ccc"
        sx={{ ":hover": { boxShadow: "10px 10px 20px #ccc" } }}
      >
        <Typography variant="h4" marginBottom={3}>
          Verify OTP
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="OTP"
            variant="outlined"
            fullWidth
            margin="normal"
            name="otp"
            value={formData.otp}
            onChange={handleInputChange}
            error={!!errors.otp}
            helperText={errors.otp}
          />
          {errors.submit && (
            <Typography color="error" marginTop={2}>
              {errors.submit}
            </Typography>
          )}
          <Button
            endIcon={<LoginOutlinedIcon />}
            type="submit"
            sx={{ marginTop: 3, borderRadius: 3 }}
            variant="contained"
            color="warning"
            fullWidth
          >
            Verify OTP
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default VerifyUser;
