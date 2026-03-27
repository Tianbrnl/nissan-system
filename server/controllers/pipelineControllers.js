import { createPipelineService, deletePipelineService, readAllPipelineService, readOnePipelineService, updatePipelineService } from "../services/pipelineServices.js";
import { getVehicleSalesByUnitsMonthly, getPaymentTermMonthly, getReservationByTeamMonthly } from "../services/vehicleSalesServices.js";
// CREATE PIPELINE 
export const createPipelineController = async (req, res) => {
    try {

        const {
            targetReleased,
            unit,
            color,
            csNumber,
            transaction,
            bank,
            client,
            grm,
            status,
            monthStart,
            remarks,
            appliedAt,
            approvedAppliedAt,
            approvedNotAppliedAt,
            availedAt,
            reservationAmount,
            reservedAt
        } = req.body;

        const result = await createPipelineService(
            targetReleased,
            unit,
            color,
            csNumber,
            transaction,
            bank,
            client,
            grm,
            status,
            monthStart,
            remarks,
            appliedAt,
            approvedAppliedAt,
            approvedNotAppliedAt,
            availedAt,
            reservationAmount,
            reservedAt
        );

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// READ ONE PIPELINE 
export const readOnePipelineController = async (req, res) => {
    try {
        const { pipelineId } = req.params;
        const result = await readOnePipelineService(pipelineId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// READ ALL PIPELINE
export const readAllPipelineController = async (req, res) => {
    try {
        const {
            page,
            limit,
            exportAll,
            month,
            search,
            status,
            grm,
            model
        } = req.query;
        const result = await readAllPipelineService({
            page: Number.parseInt(page, 10),
            limit: Number.parseInt(limit, 10),
            exportAll: exportAll === "true",
            month,
            search,
            status,
            grm,
            model
        });

        return res.json(result);
    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        })
    }
}

// UPDATE PIPELINE 
export const updatePipelineController = async (req, res) => {
    try {
        const { pipelineId } = req.params;
        const {
            targetReleased,
            unit,
            color,
            csNumber,
            transaction,
            bank,
            client,
            grm,
            status,
            monthStart,
            remarks,
            appliedAt,
            approvedAppliedAt,
            approvedNotAppliedAt,
            availedAt,
            reservationAmount,
            reservedAt
        } = req.body;

        const result = await updatePipelineService(
            pipelineId,
            targetReleased,
            unit,
            color,
            csNumber,
            transaction,
            bank,
            client,
            grm,
            status,
            monthStart,
            remarks,
            appliedAt,
            approvedAppliedAt,
            approvedNotAppliedAt,
            availedAt,
            reservationAmount,
            reservedAt
        );

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// DELETE PIPELINE
export const deletePipelineController = async (req, res) => {
    try {
        const { pipelineId } = req.params;
        const result = await deletePipelineService(pipelineId);

        return res.json(result);
    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        })
    }
}
// Vehicle Sales Report
export const vehicleSalesReport = async (req, res) => {

    const result = await getVehicleSalesByUnitsMonthly();

    res.json(result);

};
// payment term monthly 
export const paymentTermReport = async (req, res) => {
  try {
    const result = await getPaymentTermMonthly();
    res.json(result);
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};
export const reservationByTeamReport = async (req, res) => {
    try {
        const result = await getReservationByTeamMonthly();
        res.json(result);
    } catch (error){
        res.json({
            success: false,
            message: error.message
        });
    }
};
