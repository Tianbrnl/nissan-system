import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const fetchReleasePlan = async (date) => {
    try {
        const response = await axios.get(`${API_URL}/api/release/reports/release-plan`, {
            params: { date }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch release plan"
        };
    }
};

export const updateReleasePlan = async ({ date, groups }) => {
    try {
        const response = await axios.put(`${API_URL}/api/release/reports/release-plan`, {
            date,
            groups
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to update release plan"
        };
    }
};
