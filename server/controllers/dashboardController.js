import { applicationSoldService, fetchDashboardTotalService, monthlySoldTrendService, paymentTermDistributionService, reservationByTeamService } from "../services/dashboard.js";

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

        const result = await paymentTermDistributionService(req.query.monthYear);

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

        const result = await reservationByTeamService(req.query.monthYear);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// MONTHLY SOLD TREND
export const monthlySoldTrendController = async (req, res) => {
    try {

        const year = Number(req.query.year) || new Date().getFullYear();
        const result = await monthlySoldTrendService(year);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// APPLICATION SOLD
export const applicationSoldController = async (req, res) => {
    try {

        const year = Number(req.query.year) || new Date().getFullYear();
        const result = await applicationSoldService(year);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}
