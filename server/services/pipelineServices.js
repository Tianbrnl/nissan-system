
import {Pipelines, Teams, Units, Variants} from "../models/index.js";
import { capitalizeEachWord, removeUnnecessarySpaces } from "../utils/format.js";
import { Op } from "sequelize";
// CREATE PIPELINE
export const createPipelineService = async (
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
) => {
    try {
        const normalizedTargetReleased = targetReleased?.trim() || monthStart?.trim() || null;
        const normalizedMonthStart = monthStart?.trim() || normalizedTargetReleased;

        if (
            !unit.trim() ||
            !color.trim() ||
            !transaction.trim() ||
            !client.trim() ||
            !grm.trim() ||
            !normalizedMonthStart
        ) {
            return {
                success: false,
                message: "Please complete all fields to proceed."
            };
        }

        const formattedClient = capitalizeEachWord(
            removeUnnecessarySpaces(client)
        );

        // Create pipeline
        await Pipelines.create({
            targetReleased: normalizedTargetReleased,
            unitId: unit,
            color,
            csNumber,
            transaction,
            bank,
            client,
            teamId: grm,
            status,
            monthStart: normalizedMonthStart,
            remarks,
            appliedAt,
            approvedAppliedAt,
            approvedNotAppliedAt,
            availedAt,
            reservationAmount,
            reservedAt
        });

        return {
            success: true,
            message: "Pipeline created successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// READ ONE PIPELINE
export const readOnePipelineService = async (pipelineId) => {
    try {

        if (!pipelineId.trim()) {
            return {
                success: false,
                message: "Pipeline ID required."
            };
        }

        const pipeline = await Units.findOne({
            attributes: ['variantId'],
            include: [
                {
                    model: Pipelines,
                    as: 'pipelines',
                    attributes: [
                        'targetReleased',
                        'unitId',
                        'color',
                        'csNumber',
                        'transaction',
                        'bank',
                        'client',
                        'teamId',
                        'status',
                        'monthStart',
                        'remarks',
                        'appliedAt',
                        'approvedAppliedAt',
                        'approvedNotAppliedAt',
                        'availedAt',
                        'reservationAmount',
                        'reservedAt'

                    ],
                    where: { id: pipelineId }
                }
            ]
        })

        if (!pipeline) {
            return {
                success: false,
                message: "Pipeline not found."
            };
        }



        return {
            success: true,
            pipeline
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// READ ALL PIPELINE
export const readAllPipelineService = async () => {
    try {
        
        const pipelines = await Pipelines.findAll({
            attributes: [
                'id',
                'targetReleased',
                'color',
                'csNumber',
                'transaction',
                'bank',
                'client',
                'status',
                'remarks',
                'monthStart',
            ],
            include: [
                {
                    model: Units,
                    attributes: ['name'],
                    include: [
                        {
                            model: Variants,
                            attributes: ['name']
                        }
                    ]
                },
                {
                    model: Teams,
                    attributes: ['teamCode', 'teamLeader']
                }
            ]
        });

        return {
            success: true,
            pipelines
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// UPDATE PIPELINE
export const updatePipelineService = async (
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
) => {
    try {
        const normalizedTargetReleased = targetReleased?.trim() || monthStart?.trim() || null;
        const normalizedMonthStart = monthStart?.trim() || normalizedTargetReleased;

        if (
            !normalizedTargetReleased ||
            !unit ||
            !color.trim() ||
            !csNumber.trim() ||
            !transaction.trim() ||
            !client.trim() ||
            !grm ||
            !status.trim() ||
            !normalizedMonthStart
        ) {
            return {
                success: false,
                message: "Please complete all fields to proceed."
            };
        }

        // Create pipeline
        await Pipelines.update({
            targetReleased: normalizedTargetReleased,
            unitId: unit,
            color,
            csNumber,
            transaction,
            bank,
            client,
            teamId: grm,
            status,
            monthStart: normalizedMonthStart,
            remarks,
            appliedAt,
            approvedAppliedAt,
            approvedNotAppliedAt,
            availedAt,
            reservationAmount,
            reservedAt
        }, {
            where: { id: pipelineId }
        });

        return {
            success: true,
            message: "Pipeline updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// DELETE PIPELINE
export const deletePipelineService = async (pipelineId) => {
    try {
        const affectedRows = await Pipelines.destroy({
            where: { id: pipelineId }
        });

        if (affectedRows === 0) {
            return {
                success: false,
                message: 'Pipeline not found'
            };
        }

        return {
            success: true,
            message: 'Pipeline deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}
/// vehicle sales 
export const getVehicleSalesByUnitsMonthly = async () => {
    try {

        const data = await Pipelines.findAll({
            attributes: [
                [sequelize.col("targetReleased"), "targetReleaseDate"],
                [sequelize.fn("COUNT", sequelize.col("id")), "totalUnits"]
            ],
            where: {
                targetReleased: {
                    [Op.not]: null
                }
            },
            group: ["targetReleased"],
            order: [["targetReleased", "ASC"]]
        });

        return {
            success: true,
            data
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};
