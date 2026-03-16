import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// TEAM PERFORMANCE
export const fetchTeamPerformance = async (monthYear) => {
    try {
        const response = await axios.get(`${API_URL}/api/vehicleSales/teamPerformance/${monthYear}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch team performance'
        };
    }
}