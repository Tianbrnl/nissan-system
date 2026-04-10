import { readTeamMemberYearlySalesService } from "../services/teamMemberSalesService.js";

export const readTeamMemberYearlySalesController = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { year } = req.query;
        const result = await readTeamMemberYearlySalesService(memberId, year);

        return res.json(result);
    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};
