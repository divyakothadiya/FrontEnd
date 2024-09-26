import React from 'react';
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControlLabel } from "@mui/material";

const SignupPopup = ({ open, handleClose, handleCheckboxChange, signupType }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select Signup Type</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={signupType.is_customer} // Use signupType prop
              onChange={handleCheckboxChange}
              name="is_customer"
            />
          }
          label="Customer"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={signupType.is_retailer} // Use signupType prop
              onChange={handleCheckboxChange}
              name="is_retailer"
            />
          }
          label="Retailer"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignupPopup;
