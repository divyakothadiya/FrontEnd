import {
  Avatar,
  Grid,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { Country, State } from "country-state-city";
import React, { useState, useEffect } from "react";

export function ReadOnlyDetails({ details, onEditClick }) {
  console.log("ReadOnlyDetails",details)
  const [inputs, setInputs] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    phone_number: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    dob: "",
    profile_picture: "",
    gender: "",
  });

  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");

  const getValueOrEmpty = (value) => value || "";

  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem("userDetails"));

    if (storedDetails) {
      setInputs({
        first_name: getValueOrEmpty(storedDetails.first_name),
        last_name: getValueOrEmpty(storedDetails.last_name),
        email: getValueOrEmpty(storedDetails.email),
        address: getValueOrEmpty(storedDetails.address),
        phone_number: getValueOrEmpty(storedDetails.phone_number),
        country: getValueOrEmpty(storedDetails.country),
        state: getValueOrEmpty(storedDetails.state),
        city: getValueOrEmpty(storedDetails.city),
        pincode: getValueOrEmpty(storedDetails.pincode),
        dob: getValueOrEmpty(storedDetails.dob),
        profile_picture: getValueOrEmpty(storedDetails.profile_picture),
        gender: getValueOrEmpty(storedDetails.gender),
      });
    }

    if (storedDetails?.country) {
      const country = Country.getCountryByCode(storedDetails.country);
      setCountryName(country?.name || "Unknown Country");
    }

    if (storedDetails?.state && storedDetails?.country) {
      const state = State.getStateByCodeAndCountry(
        storedDetails.state,
        storedDetails.country
      );
      setStateName(state?.name || "Unknown State");
    }
  }, []);

  // Function to convert 'M' to 'Male' and 'F' to 'Female'
  const getGenderLabel = (gender) => {
    if (gender === "M") return "Male";
    if (gender === "F") return "Female";
    return "";
  };


  return (
    <div>
      <form disabled={true}>
        <Box
          display="flex"
          flexDirection={"column"}
          maxWidth={1000}
          alignItems="right"
          justifyContent={"center"}
          margin="auto"
          marginTop={5}
          padding={3}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
          sx={{ ":hover": { boxShadow: "10px 10px 20px #ccc" } }}
        >
          <Typography variant="h6" padding={3} textAlign="center">
            User Profile
          </Typography>
          <Grid item container justifyContent="center" alignItems="center">
            <Avatar
              alt="User Avatar"
              src={inputs.profile_picture}
              style={{ width: 200, height: 200 }}
            />
          </Grid>
          <TextField
            fullWidth
            name="first_name"
            value={`${inputs.first_name} ${inputs.last_name}`}
            margin="normal"
            type={"text"}
            variant="outlined"
            label="Full Name"
          />
          <TextField
            fullWidth
            name="address"
            value={inputs.address}
            margin="normal"
            type={"text"}
            variant="outlined"
            label="Address"
          />
          <TextField
            fullWidth
            name="phone_number"
            value={inputs.phone_number}
            margin="normal"
            type={"text"}
            variant="outlined"
            label="Phone Number"
          />
          <TextField
            fullWidth
            name="email"
            value={inputs.email}
            margin="normal"
            type={"email"}
            variant="outlined"
            label="Email"
          />
          <TextField
            fullWidth
            label="Country"
            value={countryName}
            variant="outlined"
            margin="normal"
            name="country"
          ></TextField>
          <TextField
            fullWidth
            name="state"
            label="State"
            margin="normal"
            value={stateName}
            variant="outlined"
          ></TextField>
          <TextField
            fullWidth
            name="city"
            label="City"
            value={inputs.city}
            variant="outlined"
            margin="normal"
          ></TextField>
          <TextField
            fullWidth
            name="pincode"
            value={inputs.pincode}
            margin="normal"
            variant="outlined"
            label="Pin Code"
          />
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            name="dob"
            value={inputs.dob ? inputs.dob.split("T")[0] : ""}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            name="gender"
            value={getGenderLabel(inputs.gender)} // Display Male or Female based on the backend value
            margin="normal"
            variant="outlined"
            label="Gender"
          />

          <Button
            type="button"
            onClick={onEditClick}
            sx={{ marginTop: 3, borderRadius: 3 }}
            variant="contained"
            color="warning"
          >
            Edit
          </Button>
        </Box>
      </form>
    </div>
  );
}
