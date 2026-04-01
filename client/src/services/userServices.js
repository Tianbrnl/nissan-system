import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// LOGIN 
export const handleLogin = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/user/login`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to login account'
        };
    }
};

// CHANGE PASSWORD
export const handleChangePassword = async (formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/user/changePassword`, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to change password'
        };
    }
};

// LOGOUT USER
export const handleLogout = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/user/logout`, { withCredentials: true });
        return response.data;

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to logout'
        };
    }
};

// FETCH USER  
export const fetchUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/user/fetchUser`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch user'
        };
    }
};
