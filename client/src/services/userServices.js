import { authApi } from './api';

// LOGIN 
export const handleLogin = async (formData) => {
    try {
        const response = await authApi.post('/api/user/login', formData);
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
        const response = await authApi.put('/api/user/changePassword', formData);
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
        const response = await authApi.get('/api/user/logout');
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
        const response = await authApi.get('/api/user/fetchUser');
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch user'
        };
    }
};
