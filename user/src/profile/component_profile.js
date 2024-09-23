import React, { useState, useEffect } from "react";
import { ReadOnlyDetails } from "./read_profile";
import { UserDetailsForm } from "./edit_profile";

export default function UserComponent() {
  const [isEditing, setIsEditing] = useState(false); // Track whether in edit mode or not
  const [userDetails, setUserDetails] = useState(null);

  // Load user details from local storage
  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem("userDetails"));
    setUserDetails(storedDetails);
  }, []);

  const handleEditClick = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const handleFormSubmit = (updatedDetails) => {
    localStorage.setItem("userDetails", JSON.stringify(updatedDetails)); // Update local storage
    setUserDetails(updatedDetails); // Update state
    setIsEditing(false); // Switch back to read-only mode
  };

  return (
    <div>
      {/* Conditionally render based on whether we are editing */}
      {isEditing ? (
        <UserDetailsForm onSubmit={handleFormSubmit} /> // Edit form when editing
      ) : userDetails ? (
        <ReadOnlyDetails details={userDetails} onEditClick={handleEditClick} /> // Read-only details when not editing
      ) : (
        <p>No user details available. Please fill in your details.</p> // Message when no details are available
      )}
    </div>
  );
}
