import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// CREATE TEAM
export const createTeam = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/team/create`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create team'
        };
    }
};

// READ ALL TEAM
export const readAllTeam = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/team/readAll`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to read all team'
        };
    }
};

// READ ALL GRM
export const readAllGrm = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/team/select/grm`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to read all grm'
        };
    }
};

// READ TEAM MEMBERS
export const readTeamMembers = async (teamId) => {
    try {
        const response = await axios.get(`${API_URL}/api/team/members/${teamId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to read team members'
        };
    }
};

// READ ONE TEAM
export const readOneTeam = async (teamId) => {
    try {
        const response = await axios.get(`${API_URL}/api/team/readOne/${teamId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to read team'
        };
    }
};

// READ ONE TEAM
export const updateTeam = async (teamId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/api/team/update/${teamId}`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update team'
        };
    }
};

// DELETE TEAM
export const deleteTeam = async (teamId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/team/delete/${teamId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete team'
        };
    }
};
