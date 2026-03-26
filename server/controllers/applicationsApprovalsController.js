import { applicationsApprovalsService, teamPerformanceService } from "../services/applicationsApprovals.js";

export const teamPerformanceController = async (req, res) => {
    try {
        const { monthYear } = req.params;

        const result = await teamPerformanceService(monthYear);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

export const applicationsApprovalsController = async (req, res) => {
    try {
        const { year } = req.params;

        const result = await applicationsApprovalsService(year);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}