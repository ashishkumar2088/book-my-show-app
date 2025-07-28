import axios from 'axios';

// Public axios instance for non-authenticated requests (movies, etc.)
export const publicAxiosInstance = axios.create({
    headers:{
        'Content-Type':'application/json'
    }
});

// Authenticated axios instance for protected requests (user actions, bookings, etc.)
export const axiosInstance = axios.create({
    headers:{
        'Content-Type':'application/json'
    }
});

// Add request interceptor to dynamically add token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-access-token'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

