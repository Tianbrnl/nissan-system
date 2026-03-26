import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// FETCH DASHBOARD TOTALS
export const fetchDashboardTotals = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/dashboard/totals`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch dashboard totals'
        };
    }
}

// PAYMENT TERM DISTRIBUTION
export const paymentTermDistribution = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/dashboard/paymentTermDistribution`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch payment term distribution'
        };
    }
}

// RESERVATION BY TEAM
export const reservationByTeam = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/dashboard/reservationByTeam`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch reservation by team'
        };
    }
}

// MONTHLY SOLD TREND
export const fetchMonthlySoldTrend = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/dashboard/monthlySoldTrend`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch monthly sold trend'
        };
    }
}


// APPLICATION SOLD
export const fetchApplicationSold = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/dashboard/applicationSold`);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch application sold'
        };
    }
}

