
import { Pipelines, TeamMembers, Teams, Units, Variants } from "../models/index.js";
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

const normalizeOptionalDate = (value) => {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value !== "string") {
        return null;
    }

    const trimmedValue = value.trim();

    if (!trimmedValue || trimmedValue === "Invalid date" || trimmedValue === "0000-00-00") {
        return null;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
        return null;
    }

    const parsedDate = new Date(`${trimmedValue}T00:00:00Z`);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return trimmedValue;
};

const normalizeOptionalInteger = (value) => {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value === "string") {
        const trimmedValue = value.trim();

        if (!trimmedValue) {
            return null;
        }

        const parsedValue = Number.parseInt(trimmedValue, 10);

        return Number.isNaN(parsedValue) ? null : parsedValue;
    }

    if (typeof value === "number") {
        return Number.isInteger(value) ? value : null;
    }

    return null;
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
    member,
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
        const normalizedTargetReleased = normalizeOptionalDate(targetReleased);
        const normalizedMonthStart = normalizeOptionalDate(monthStart) || normalizedTargetReleased || null;
        const normalizedAppliedAt = normalizeOptionalDate(appliedAt);
        const normalizedApprovedAppliedAt = normalizeOptionalDate(approvedAppliedAt);
        const normalizedApprovedNotAppliedAt = normalizeOptionalDate(approvedNotAppliedAt);
        const normalizedAvailedAt = normalizeOptionalDate(availedAt);
        const normalizedReservationAmount = normalizeOptionalInteger(reservationAmount);
        const normalizedReservedAt = normalizeOptionalDate(reservedAt);

        if (
            !unit||
            !color.trim() ||
            !transaction.trim() ||
            !client.trim() ||
            !grm
        ) {
            return {
                success: false,
                message: "Please complete all fields to proceed."
            };
        }

        let memberId = null;

        if (member) {
            const selectedMember = await TeamMembers.findOne({
                where: {
                    id: member,
                    teamId: grm
                }
            });

            if (!selectedMember) {
                return {
                    success: false,
                    message: "Please select a valid team member."
                };
            }

            memberId = selectedMember.id;
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
            client: formattedClient,
            teamId: grm,
            memberId,
            status,
            monthStart: normalizedMonthStart,
            remarks,
            appliedAt: normalizedAppliedAt,
            approvedAppliedAt: normalizedApprovedAppliedAt,
            approvedNotAppliedAt: normalizedApprovedNotAppliedAt,
            availedAt: normalizedAvailedAt,
            reservationAmount: normalizedReservationAmount,
            reservedAt: normalizedReservedAt
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
                        'memberId',
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
        const include = [
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
            },
            {
                model: TeamMembers,
                as: 'member',
                attributes: ['id', 'memberName'],
                required: false
            }
        ];
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
            include,
            where,
            order: [['targetReleased', 'DESC'], ['id', 'DESC']],
            distinct: true,
            subQuery: false
        };

        if (!shouldExportAll) {
            queryOptions.offset = offset;
            queryOptions.limit = pageSize;
        }

        const buildStatusCountQuery = (statusValue) => ({
            include,
            where: {
                ...where,
                status: statusValue
            },
            distinct: true,
            subQuery: false
        });

        const [
            { count, rows },
            sold,
            forRelease,
            bankApproval
        ] = await Promise.all([
            Pipelines.findAndCountAll(queryOptions),
            Pipelines.count(buildStatusCountQuery("Sold")),
            Pipelines.count(buildStatusCountQuery("For Release")),
            Pipelines.count(buildStatusCountQuery("For Bank Approval"))
        ]);

        const totalItems = count;
        const totalPages = shouldExportAll
            ? (totalItems === 0 ? 0 : 1)
            : (totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize));

        return {
            success: true,
            data: rows,
            totals: {
                entries: totalItems,
                sold,
                forRelease,
                bankApproval
            },
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
    member,
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
        const normalizedTargetReleased = normalizeOptionalDate(targetReleased) || normalizeOptionalDate(monthStart) || null;
        const normalizedMonthStart = normalizeOptionalDate(monthStart) || normalizedTargetReleased || null;
        const normalizedAppliedAt = normalizeOptionalDate(appliedAt);
        const normalizedApprovedAppliedAt = normalizeOptionalDate(approvedAppliedAt);
        const normalizedApprovedNotAppliedAt = normalizeOptionalDate(approvedNotAppliedAt);
        const normalizedAvailedAt = normalizeOptionalDate(availedAt);
        const normalizedReservationAmount = normalizeOptionalInteger(reservationAmount);
        const normalizedReservedAt = normalizeOptionalDate(reservedAt);

        if (
            !unit ||
            !color.trim() ||
            !transaction.trim() ||
            !client.trim() ||
            !grm
        ) {
            return {
                success: false,
                message: "Please complete all fields to proceed."
            };
        }

        let memberId = null;

        if (member) {
            const selectedMember = await TeamMembers.findOne({
                where: {
                    id: member,
                    teamId: grm
                }
            });

            if (!selectedMember) {
                return {
                    success: false,
                    message: "Please select a valid team member."
                };
            }

            memberId = selectedMember.id;
        }

        // Create pipeline
        await Pipelines.update({
            targetReleased: normalizedTargetReleased,
            unitId: unit,
            color,
            csNumber,
            transaction,
            bank,
            client: capitalizeEachWord(removeUnnecessarySpaces(client)),
            teamId: grm,
            memberId,
            status,
            monthStart: normalizedMonthStart,
            remarks,
            appliedAt: normalizedAppliedAt,
            approvedAppliedAt: normalizedApprovedAppliedAt,
            approvedNotAppliedAt: normalizedApprovedNotAppliedAt,
            availedAt: normalizedAvailedAt,
            reservationAmount: normalizedReservationAmount,
            reservedAt: normalizedReservedAt
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
