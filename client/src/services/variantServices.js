import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// CREATE VARIANT
export const createVariant = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/variant/create`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create variant'
        };
    }
};

// READ ONE UNIT
export const readOneUnit = async (unitId) => {
    try {
        const response = await axios.get(`${API_URL}/api/variant/unit/readOne/${unitId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to read unit'
        };
    }
};

// SELECT READ ALL VARIANT
export const selectReadAllVariant = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/variant/select/readAll`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to read all variant'
        };
    }
};

// SELECT READ ALL UNIT
export const selectReadUnitVariant = async (variantId) => {
    try {
        const response = await axios.get(`${API_URL}/api/variant/unit/select/readAll/${variantId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to read all unit'
        };
    }
};

// UPDATE UNIT
export const updateUnit = async (unitId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/variant/unit/update/${unitId}`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update unit'
        };
    }
};

// UPDATE VARIANT
export const updateVariant = async (variantId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/variant/update/${variantId}`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update unit'
        };
    }
};