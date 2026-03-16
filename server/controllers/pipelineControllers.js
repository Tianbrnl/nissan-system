import { createPipelineService, deletePipelineService, readAllPipelineService, readOnePipelineService, updatePipelineService } from "../services/pipelineServices.js";

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
        const result = await readAllPipelineService();

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