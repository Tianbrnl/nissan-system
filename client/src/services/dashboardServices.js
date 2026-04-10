import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const normalizeMonthYearParam = (monthYear) => {
    if (typeof monthYear !== 'string') {
        return undefined;
    }

    const trimmedMonthYear = monthYear.trim();

    if (!/^\d{4}-\d{2}$/.test(trimmedMonthYear)) {
        return undefined;
    }

    return trimmedMonthYear;
};

const normalizeYearParam = (year) => {
    const parsedYear = Number(year);

    if (!Number.isInteger(parsedYear) || parsedYear < 1000 || parsedYear > 9999) {
        return undefined;
    }

    return parsedYear;
};

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
export const paymentTermDistribution = async (monthYear) => {
    try {
        const response = await axios.get(`${API_URL}/api/dashboard/paymentTermDistribution`, {
            params: { monthYear: normalizeMonthYearParam(monthYear) }
        });
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
export const reservationByTeam = async (monthYear) => {
    try {
        const response = await axios.get(`${API_URL}/api/dashboard/reservationByTeam`, {
            params: { monthYear: normalizeMonthYearParam(monthYear) }
        });
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
export const fetchMonthlySoldTrend = async (year) => {
    try {
        const response = await axios.get(`${API_URL}/api/dashboard/monthlySoldTrend`, {
            params: { year: normalizeYearParam(year) }
        });
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
export const fetchApplicationSold = async (year) => {
    try {
        const response = await axios.get(`${API_URL}/api/dashboard/applicationSold`, {
            params: { year: normalizeYearParam(year) }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch application sold'
        };
    }
}
