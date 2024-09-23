import React, { useState, useEffect, useCallback } from "react";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { Country, State, City } from "country-state-city";
import { postcodeValidator } from "postcode-validator";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ErrorIcon from "@mui/icons-material/Error";
import { useServicesHook } from "../Hooks/serviceHooks";
import { useNavigate } from "react-router-dom";

export function UserDetailsForm({ onSubmit }) {
  const navigate = useNavigate();
  const { updateUser } = useServicesHook();
  const [fileError, setFileError] = useState("");
  const [base64String, setBase64String] = useState("");
  const [isValidPincode, setIsValidPincode] = useState(false);
  let storedDetails = "";

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const getValueOrEmpty = (value) => value || "";
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    phone_number: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    dob: null,
    profile_picture: "",
    gender: "",
  });

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

  // Load country list on mount
  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      isoCode: country.isoCode,
      name: country.name,
    }));
    setCountryList(countries);

    // Load details from localStorage
    storedDetails = JSON.parse(localStorage.getItem("userDetails"));
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

      // Set base64String for profile picture preview
      setBase64String(getValueOrEmpty(storedDetails.profile_picture));

      // Set selected country, state, and city
      setSelectedCountry(getValueOrEmpty(storedDetails.country));
      setSelectedState(getValueOrEmpty(storedDetails.state));
      setSelectedCity(getValueOrEmpty(storedDetails.city));
    }
  }, []);

  // Update stateList and cityList when selectedCountry or selectedState changes
  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry).map((state) => ({
        isoCode: state.isoCode,
        name: state.name,
      }));
      setStateList(states);
    } else {
      setStateList([]);
    }
    // Check if storedDetails already has state and city
    if (storedDetails && storedDetails.state) {
        setSelectedState(storedDetails.state);
    }
  }, [selectedCountry]); // Recalculate states list when the country changes

  useEffect(() => {
    if (selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState).map(
        (city) => ({
          name: city.name,
        })
      );
      setCityList(cities);
    } else {
      setCityList([]);
    }
    // Reset city when state changes
    if (storedDetails && storedDetails.city) {
        setSelectedCity(storedDetails.city);
    }
  }, [selectedState]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_picture") {
      const file = files[0];
      if (file) {
        // Validate file type and size
        if (
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg"
        ) {
          if (file.size > 1024 * 1024) {
            setFileError("File size exceeds 1 MB");
          } else {
            const reader = new FileReader();
            reader.onload = (e) => {
              setBase64String(e.target.result);
              setInputs((prevInputs) => ({
                ...prevInputs,
                profile_picture: e.target.result,
              }));
              setFileError("");
            };
            reader.readAsDataURL(file);
          }
        } else {
          setFileError(
            "Unsupported file type. Please select a PNG, JPG, or JPEG file."
          );
        }
      }
    } else if (name === "gender") {
      setInputs((prevInputs) => ({
        ...prevInputs,
        gender: value, // Store as "M" or "F"
      }));
    } else if (name === "country") {
      setSelectedCountry(value);
      setInputs((prevInputs) => ({
        ...prevInputs,
        country: value,
        state: "",
        city: "",
      }));
    } else if (name === "state") {
      setSelectedState(value);
      setInputs((prevInputs) => ({
        ...prevInputs,
        state: value,
        city: "",
      }));
    } else if (name === "city") {
      setSelectedCity(value);
      setInputs((prevInputs) => ({
        ...prevInputs,
        city: value,
      }));
    } else {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value,
      }));
    }
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault(); // Prevent default form submission

      try {
        console.log("Update User Form submitted successfully!", inputs);
        await updateUser(inputs); // Submit form data
        // Update localStorage
        localStorage.setItem("userDetails", JSON.stringify(inputs));
        onSubmit(inputs); // Call the parent onSubmit function
      } catch (e) {
        console.error("Error submitting update user form:", e);
      }
    },
    [updateUser, inputs, onSubmit]
  );

  const validateField = (fieldName, value) => {
    let errorMessage = "";
    switch (fieldName) {
      case "first_name":
        errorMessage = value.trim() === "" ? "First Name is required" : "";
        break;
      case "last_name":
        errorMessage = value.trim() === "" ? "Last Name is required" : "";
        break;
      case "phone_number":
        const phoneRegex = /^\d{10}$/; // Regex for 10-digit phone number
        errorMessage = phoneRegex.test(value)
          ? ""
          : "Please enter a valid 10-digit phone number";
        break;
      case "address":
        errorMessage = value.trim() === "" ? "Address is required" : "";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        errorMessage = emailRegex.test(value)
          ? ""
          : "Please enter a valid email";
        break;
      case "gender":
        errorMessage = value.trim() === "" ? "Please select gender" : "";
        break;
      case "pincode":
        if (selectedCountry) {
          const pinCodeValidator = postcodeValidator(value, selectedCountry);
          setIsValidPincode(pinCodeValidator);
          errorMessage = pinCodeValidator ? "" : "Please enter valid pin code";
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: errorMessage }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        display="flex"
        flexDirection={"column"}
        maxWidth={1000}
        alignItems="center"
        justifyContent={"center"}
        margin="auto"
        marginTop={5}
        padding={3}
        borderRadius={5}
        boxShadow={"5px 5px 10px #ccc"}
        sx={{ ":hover": { boxShadow: "10px 10px 20px #ccc" } }}
      >
        <Typography variant="h4" padding={3} textAlign="center">
          User Details
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            accept="image/png, image/jpeg, image/jpg"
            id="contained-button-file"
            multiple={false}
            type="file"
            style={{ display: "none" }}
            onChange={handleChange}
            name="profile_picture"
          />
          <label htmlFor="contained-button-file">
            <Avatar
              alt="Uploaded Image"
              src={base64String}
              style={{
                width: 150,
                height: 150,
                border: fileError ? "2px solid red" : "none",
              }}
            >
              {fileError ? <ErrorIcon /> : <PhotoCamera />}{" "}
            </Avatar>
          </label>
          {fileError && <p style={{ color: "red" }}> {fileError} </p>}{" "}
        </div>

        <TextField
          fullWidth
          onChange={handleChange}
          name="first_name"
          value={inputs.first_name}
          margin="normal"
          type={"text"}
          label="First Name"
          onBlur={() => validateField("first_name", inputs.first_name)}
          error={Boolean(errors.first_name)}
          helperText={errors.first_name}
        />
        <TextField
          fullWidth
          onChange={handleChange}
          name="last_name"
          value={inputs.last_name}
          margin="normal"
          type={"text"}
          label="Last Name"
          onBlur={() => validateField("last_name", inputs.last_name)}
          error={Boolean(errors.last_name)}
          helperText={errors.last_name}
        />
        <TextField
          fullWidth
          onChange={handleChange}
          name="email"
          value={inputs.email}
          margin="normal"
          type={"email"}
          label="Email"
          onBlur={() => validateField("email", inputs.email)}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          onChange={handleChange}
          name="phone_number"
          value={inputs.phone_number}
          margin="normal"
          type={"text"}
          label="Phone Number"
          onBlur={() => validateField("phone_number", inputs.phone_number)}
          error={Boolean(errors.phone_number)}
          helperText={errors.phone_number}
        />
        <TextField
          fullWidth
          onChange={handleChange}
          name="address"
          value={inputs.address}
          margin="normal"
          type={"text"}
          label="Address"
          onBlur={() => validateField("address", inputs.address)}
          error={Boolean(errors.address)}
          helperText={errors.address}
        />
        <TextField
          fullWidth
          select
          onChange={handleChange}
          name="gender"
          value={inputs.gender}
          margin="normal"
          label="Gender"
          onBlur={() => validateField("gender", inputs.gender)}
          error={Boolean(errors.gender)}
          helperText={errors.gender}
        >
          <MenuItem value="M">Male</MenuItem>
          <MenuItem value="F">Female</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          onChange={handleChange}
          name="country"
          value={selectedCountry}
          margin="normal"
          label="Country"
          error={Boolean(errors.country)}
          helperText={errors.country}
        >
          {countryList.map((country) => (
            <MenuItem key={country.isoCode} value={country.isoCode}>
              {country.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          onChange={handleChange}
          name="state"
          value={selectedState}
          margin="normal"
          label="State"
          error={Boolean(errors.state)}
          helperText={errors.state}
          disabled={!selectedCountry}
        >
          {stateList.map((state) => (
            <MenuItem key={state.isoCode} value={state.isoCode}>
              {state.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          onChange={handleChange}
          name="city"
          value={selectedCity}
          margin="normal"
          label="City"
          error={Boolean(errors.city)}
          helperText={errors.city}
          disabled={!selectedState}
        >
          {cityList.map((city, index) => (
            <MenuItem key={index} value={city.name}>
              {city.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          onChange={handleChange}
          name="pincode"
          value={inputs.pincode}
          margin="normal"
          type={"text"}
          label="Pincode"
          onBlur={() => validateField("pincode", inputs.pincode)}
          error={Boolean(errors.pincode)}
          helperText={errors.pincode}
          disabled={!selectedCountry}
        />
        <TextField
          fullWidth
          onChange={handleChange}
          name="dob"
          value={inputs.dob}
          margin="normal"
          type={"date"}
          label="Date of Birth"
          InputLabelProps={{
            shrink: true,
          }}
          onBlur={() => validateField("dob", inputs.dob)}
          error={Boolean(errors.dob)}
          helperText={errors.dob}
        />

        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 3, borderRadius: 3 }}
          type="submit"
        >
          Submit
        </Button>
      </Box>
    </form>
  );
}
