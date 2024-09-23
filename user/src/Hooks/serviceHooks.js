import { useCallback } from "react";
import axios from "axios";
import axiosInstance from "../axios-config";

export function useServicesHook() {
    const customHeaders = {
        'content-type': 'application/json',
      };
    const createUser = useCallback((userDetails) => {
        
        return axiosInstance.post('user/register/', userDetails)
            .then(data => {
                if (data) {
                    alert("User created successfully");
                }
            })
            .catch(error => Promise.reject(error.message));
    },[]);

    const loginUser = useCallback((loginDetails) => {
        
        return axiosInstance.post('user/login/', loginDetails)
            .then(data => {
                if (data) {
                    alert("User loggedin successfully");
                    console.log("is_profile_complete:", data.data.is_profile_complete);
                    console.log("token:",  data.data.token["access"]);

                    // Store token and profile completion status
                    localStorage.setItem('token', data.data.token["access"]);
                    localStorage.setItem('is_profile_complete', data.data.is_profile_complete);
                    localStorage.setItem('userDetails', JSON.stringify(data.data.profile));

                    // Return token and profile completion status for further use
                    return {
                        token: data.data.token,
                        isProfileComplete: data.data.is_profile_complete
                    };
                }
            })
            .catch(error => Promise.reject(error.message));
    },[]);

    const updateUser = useCallback((userDetails) => {
        return axiosInstance.put('user/update-profile/', userDetails) // Assuming PUT request for updating user
            .then(data => {
                if (data) {
                    console.log("Updated userDetails:", data);
                }
            })
            .catch(error => Promise.reject(error.message));
    }, []);

    return { createUser,loginUser, updateUser};
}