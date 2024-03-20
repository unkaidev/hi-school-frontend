import axios from "axios";
import { toast } from "react-toastify";

// Create an Axios instance with default configuration
const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
});

// Set Authorization header using the stored JWT token
const token = localStorage.getItem('hischool');
if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Do something with response data
        return response.data;
    },
    function (error) {
        const status = error?.response?.status || 500;

        // Handle different HTTP status codes
        switch (status) {
            case 401:
                if (window.location.pathname !== '/' &&
                    window.location.pathname !== '/login' &&
                    window.location.pathname !== '/register') {
                    console.error('Error occurred:', error);
                }
                return error.response.data;

            case 403:
                console.error('You don\'t have permission to access:', error);
                return Promise.reject(error);

            case 400:
                console.error('Bad request:', error);

            case 404:
            case 409:
            case 422:
                return Promise.reject(error);

            default:
                return Promise.reject(error);
        }
    }

);

export default instance;
