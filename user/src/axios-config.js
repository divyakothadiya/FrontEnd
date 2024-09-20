import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 10000
});

axiosInstance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");

    // Don't attach token for login, signup, and verify endpoints
    const excludedEndpoints = ['user/login/', 'user/register/', 'user/verify/'];
    const isExcludedEndpoint = excludedEndpoints.some(endpoint => config.url.includes(endpoint));

    if (token && !isExcludedEndpoint) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default axiosInstance;
