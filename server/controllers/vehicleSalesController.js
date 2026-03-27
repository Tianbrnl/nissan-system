import { readAllTeamPerformanceService, unitDestributionService } from "../services/vehicleSalesServices.js";


// READ ALL TEAM PERFORMANCE 
export const readAllTeamPerformanceController = async (req, res) => {
    try {
        
        const { monthYear } = req.params;
        const result = await readAllTeamPerformanceService(monthYear);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// UNIT DESTRIBUTION
export const unitDestributionController = async (req, res) => {
    try {
        
        const { monthYear } = req.params;
        const result = await unitDestributionService(monthYear);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}
