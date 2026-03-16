import { fetchDashboardTotalService, paymentTermDistributionService, reservationByTeamService } from "../services/dashboard.js";

// FETCH DASHBOARD TOTALS
export const fetchDashboardTotalController = async (req, res) => {
    try {

        const result = await fetchDashboardTotalService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// PAYMENT TERM DISTRIBUTION
export const paymentTermDistributionCOntroller = async (req, res) => {
    try {

        const result = await paymentTermDistributionService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// RESERVATION BY TEAM
export const reservationByTeamController = async (req, res) => {
    try {

        const result = await reservationByTeamService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}
