import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// CREATE PIPELINE
export const createPipeline = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/pipeline/create`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create pipeline'
        };
    }
};

// READ ONE PIPELINE
export const readOnePipeline = async (pipelineId) => {
    try {
        const response = await axios.get(`${API_URL}/api/pipeline/readOne/${pipelineId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to read pipeline'
        };
    }
};

// READ ALL PIPELINE
export const readAllPipeline = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/pipeline/readAll`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to read all pipeline'
        };
    }
};

// UPDATE PIPELINE
export const updatePipeline = async (pipelineId, formData) => {
    try {

        const response = await axios.put(`${API_URL}/api/pipeline/update/${pipelineId}`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update pipeline'
        };
    }
};

// DELETE PIPELINE
export const deletePipeline = async (pipelineId) => {
    try {

        const response = await axios.delete(`${API_URL}/api/pipeline/delete/${pipelineId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete pipeline'
        };
    }
};
