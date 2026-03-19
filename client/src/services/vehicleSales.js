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

// VEHICLE SALES REPORT
export const fetchVehicleSalesReport = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/pipeline/reports/vehicle-sales`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch vehicle sales report",
    };
  }
};
// PAYMENT TERM REPORT
export const fetchPaymentTermReport = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/pipeline/reports/payment-term`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch payment term report",
    };
  }
};
// RESERVATION BY TEAM REPORT
export const fetchReservationByTeamReport = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/pipeline/reports/reservation-team`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch reservation by team report",
    };
  }
}