
import { Pipelines, Teams, Units, Variants } from "../models/index.js";
import { capitalizeEachWord, removeUnnecessarySpaces } from "../utils/format.js";
import { Op } from "sequelize";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const parsePositiveInt = (value, fallback) => {
    const parsedValue = Number.parseInt(value, 10);

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
        return fallback;
    }

    return parsedValue;
};

const getMonthDateRange = (month) => {
    if (typeof month !== "string" || !/^\d{4}-\d{2}$/.test(month)) {
        return null;
    }

    const [year, monthIndex] = month.split("-").map(Number);
    const startDate = new Date(year, monthIndex - 1, 1);
    const endDate = new Date(year, monthIndex, 0);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return null;
    }

    const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    return {
        monthStart: formatDate(startDate),
        monthEnd: formatDate(endDate)
    };
};

const normalizeFilterValue = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
};

const shouldApplyNamedFilter = (value, allValueLabel) => {
    return value && value !== allValueLabel;
};

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
            !grm ||
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
export const readAllPipelineService = async ({ page, limit, exportAll = false, month, search, status, grm, model } = {}) => {
    try {
        const currentPage = parsePositiveInt(page, DEFAULT_PAGE);
        const pageSize = parsePositiveInt(limit, DEFAULT_LIMIT);
        const shouldExportAll = exportAll === true;
        const monthDateRange = getMonthDateRange(month);
        const normalizedSearch = normalizeFilterValue(search);
        const normalizedStatus = normalizeFilterValue(status);
        const normalizedGrm = normalizeFilterValue(grm);
        const normalizedModel = normalizeFilterValue(model);
        const where = {};
        const andConditions = [];

        if (monthDateRange) {
            where.targetReleased = {
                [Op.between]: [monthDateRange.monthStart, monthDateRange.monthEnd]
            };
        }

        if (normalizedSearch) {
            andConditions.push({
                [Op.or]: [
                    {
                        csNumber: {
                            [Op.like]: `%${normalizedSearch}%`
                        }
                    },
                    {
                        client: {
                            [Op.like]: `%${normalizedSearch}%`
                        }
                    },
                    {
                        "$unit.variant.name$": {
                            [Op.like]: `%${normalizedSearch}%`
                        }
                    }
                ]
            });
        }

        if (shouldApplyNamedFilter(normalizedStatus, "All Statuses")) {
            andConditions.push({
                status: normalizedStatus
            });
        }

        if (shouldApplyNamedFilter(normalizedGrm, "All GRMs")) {
            andConditions.push({
                "$team.teamLeader$": normalizedGrm
            });
        }

        if (shouldApplyNamedFilter(normalizedModel, "All Models")) {
            andConditions.push({
                "$unit.variant.name$": normalizedModel
            });
        }

        if (andConditions.length > 0) {
            where[Op.and] = andConditions;
        }

        const offset = (currentPage - 1) * pageSize;
        const queryOptions = {
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
            ],
            where,
            order: [['targetReleased', 'DESC'], ['id', 'DESC']],
            distinct: true,
            subQuery: false
        };

        if (!shouldExportAll) {
            queryOptions.offset = offset;
            queryOptions.limit = pageSize;
        }

        const { count, rows } = await Pipelines.findAndCountAll(queryOptions);

        const totalItems = count;
        const totalPages = shouldExportAll
            ? (totalItems === 0 ? 0 : 1)
            : (totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize));

        return {
            success: true,
            data: rows,
            pagination: {
                totalItems,
                totalPages,
                currentPage: shouldExportAll ? 1 : currentPage,
                pageSize: shouldExportAll ? totalItems : pageSize
            }
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
            !unit.trim() ||
            !color.trim() ||
            !transaction.trim() ||
            !client.trim() ||
            !grm||
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
