import { Pipelines, Teams } from "../models/index.js";
import { Op, fn, col, literal, Sequelize } from "sequelize";

// FETCH DASHBOARD TOTALS
export const fetchDashboardTotalService = async () => {
    try {

        let totals = {
            totalSales: 0,
            yearTodaySales: 0,
            totalReservation: 0,
            approvalRate: 0,
        };

        // total sales
        totals.totalSales = await Pipelines.count({
            where: {
                availedAt: {
                    [Op.ne]: '0000-00-00'
                },
            }
        });

        // year to date sales
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);

        totals.yearTodaySales = await Pipelines.count({
            where: {
                createdAt: {
                    [Op.gte]: startOfYear
                },
                availedAt: {
                    [Op.ne]: '0000-00-00'
                }
            },
        });

        // total reservations
        totals.totalReservation = await Pipelines.count({
            where: {
                reservedAt: {
                    [Op.ne]: '0000-00-00'
                },
            }
        });

        // total applied
        const totalApplied = await Pipelines.count({
            where: {
                appliedAt: {
                    [Op.ne]: '0000-00-00'
                }
            }
        });

        // total approved
        const totalApproved = await Pipelines.count({
            where: {
                approvedAppliedAt: {
                    [Op.ne]: '0000-00-00'
                }
            }
        });

        // approval rate
        totals.approvalRate = totalApplied === 0 ? 0 : ((totalApproved / totalApplied) * 100).toFixed(2);

        return {
            success: true,
            totals,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// PAYMENT TERM DISTRIBUTION
export const paymentTermDistributionService = async (monthYear) => {
    try {
        const [year, month] = String(monthYear || "").split("-").map(Number);
        const selectedYear = year || new Date().getFullYear();
        const selectedMonth = month || new Date().getMonth() + 1;
        const monthFilter = {
            [Op.and]: [
                Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("monthStart")), selectedYear),
                Sequelize.where(Sequelize.fn("MONTH", Sequelize.col("monthStart")), selectedMonth)
            ]
        };

        const cash = await Pipelines.count({
            where: {
                transaction: 'Cash',
                ...monthFilter
            }
        });

        const financing = await Pipelines.count({
            where: {
                transaction: 'Financing',
                ...monthFilter
            }
        });
        const bankOp = await Pipelines.count({
            where: {
                transaction: 'Bank OP',
                ...monthFilter
            }
        });

        return {
            success: true,
            paymentTerm: [
                { name: 'Cash', data: cash },
                { name: 'Financing', data: financing },
                { name: 'Bank OP', data: bankOp }
            ],
            selectedYear,
            selectedMonth
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// RESERVATION BY TEAM
export const reservationByTeamService = async (monthYear) => {
    try {
        const [year, month] = String(monthYear || "").split("-").map(Number);
        const selectedYear = year || new Date().getFullYear();
        const selectedMonth = month || new Date().getMonth() + 1;

        const result = await Pipelines.findAll({
            attributes: [
                // Concatenate teamCode and teamLeader as "teamCode - teamLeader"
                [literal("CONCAT(team.teamCode, ' - ', team.teamLeader)"), "teamName"],
                [fn('COUNT', col('pipeline.id')), 'reservedCount']
            ],
            include: [
                {
                    model: Teams,
                    as: 'team', // make sure your association alias matches
                    attributes: []
                }
            ],
            where: {
                [Op.and]: [
                    {
                        reservedAt: {
                            [Op.ne]: '0000-00-00'
                        }
                    },
                    Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("reservedAt")), selectedYear),
                    Sequelize.where(Sequelize.fn("MONTH", Sequelize.col("reservedAt")), selectedMonth)
                ]
            },
            group: ['team.id'],
            raw: true
        });

        const teams = result.map(r => ({
            name: r.teamName,
            data: r.reservedCount
        }));

        return {
            success: true,
            teams,
            selectedYear,
            selectedMonth
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        };
    }
};

// MONTHLY SOLD TREND
export const monthlySoldTrendService = async (selectedYear = new Date().getFullYear()) => {
    try {

        const currentYear = Number(selectedYear);
        const previousYear = currentYear - 1;

        const results = await Pipelines.findAll({
            attributes: [
                [Sequelize.fn("YEAR", Sequelize.col("monthStart")), "year"],
                [Sequelize.fn("MONTH", Sequelize.col("monthStart")), "month"],
                [
                    Sequelize.fn(
                        "SUM",
                        Sequelize.literal(`CASE WHEN status = 'Sold' THEN 1 ELSE 0 END`)
                    ),
                    "sold"
                ]
            ],
            where: Sequelize.where(
                Sequelize.fn("YEAR", Sequelize.col("monthStart")),
                { [Op.in]: [previousYear, currentYear] }
            ),
            group: [
                Sequelize.fn("YEAR", Sequelize.col("monthStart")),
                Sequelize.fn("MONTH", Sequelize.col("monthStart"))
            ],
            order: [
                [Sequelize.fn("MONTH", Sequelize.col("monthStart")), "ASC"]
            ],
            raw: true
        });

        const months = [
            "JAN","FEB","MAR","APR","MAY","JUN",
            "JUL","AUG","SEP","OCT","NOV","DEC"
        ];

        const monthlySoldTrend = months.map(month => ({
            month,
            lastYear: 0,
            thisYear: 0
        }));

        results.forEach(row => {
            const monthIndex = Number(row.month) - 1;

            if (Number(row.year) === currentYear) {
                monthlySoldTrend[monthIndex].thisYear = Number(row.sold) || 0;
            } else if (Number(row.year) === previousYear) {
                monthlySoldTrend[monthIndex].lastYear = Number(row.sold) || 0;
            }
        });

        return {
            success: true,
            monthlySoldTrend,
            selectedYear: currentYear,
            previousYear
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        };
    }
};

// APPLICATION SOLD
export const applicationSoldService = async (selectedYear = new Date().getFullYear()) => {
    try {

        const currentYear = Number(selectedYear);

        const results = await Pipelines.findAll({
            attributes: [
                [Sequelize.fn("MONTH", Sequelize.col("monthStart")), "month"],
                [
                    Sequelize.fn(
                        "SUM",
                        Sequelize.literal(`CASE WHEN status = 'Sold' THEN 1 ELSE 0 END`)
                    ),
                    "sold"
                ],
                [
                    Sequelize.fn(
                        "SUM",
                        Sequelize.literal(`CASE WHEN appliedAt IS NOT NULL THEN 1 ELSE 0 END`)
                    ),
                    "applications"
                ]
            ],
            where: Sequelize.where(
                Sequelize.fn("YEAR", Sequelize.col("monthStart")),
                currentYear
            ),
            group: [Sequelize.fn("MONTH", Sequelize.col("monthStart"))],
            order: [[Sequelize.fn("MONTH", Sequelize.col("monthStart")), "ASC"]],
            raw: true
        });

        const months = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

        // default months (ensures JAN–DEC always exist)
        const applicationSold = months.map((month) => ({
            month,
            applications: 0,
            sold: 0
        }));

        results.forEach(row => {
            const monthIndex = Number(row.month) - 1;

            applicationSold[monthIndex] = {
                month: months[monthIndex],
                applications: Number(row.applications) || 0,
                sold: Number(row.sold) || 0
            };
        });

        return {
            success: true,
            applicationSold,
            selectedYear: currentYear
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        };
    }
};
