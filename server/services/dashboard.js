import { Pipelines, Teams } from "../models/index.js";
import { Op, fn, col, literal, Sequelize } from "sequelize";

const getCurrentMonthYear = () => ({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
});

const parseDashboardMonthYear = (monthYear) => {
    if (typeof monthYear !== "string") {
        return getCurrentMonthYear();
    }

    const trimmedMonthYear = monthYear.trim();

    if (!/^\d{4}-\d{2}$/.test(trimmedMonthYear)) {
        return getCurrentMonthYear();
    }

    const [year, month] = trimmedMonthYear.split("-").map(Number);

    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
        return getCurrentMonthYear();
    }

    return { year, month };
};

const parseDashboardYear = (selectedYear) => {
    const parsedYear = Number(selectedYear);

    if (!Number.isInteger(parsedYear) || parsedYear < 1000 || parsedYear > 9999) {
        return new Date().getFullYear();
    }

    return parsedYear;
};

const paymentTermLabelMap = {
    CASH: "Cash",
    FINANCING: "Financing",
    "BANK OP": "Bank PO",
    "BANK PO": "Bank PO"
};

const dashboardReportDateExpression = Sequelize.fn(
    "COALESCE",
    Sequelize.col("targetReleased"),
    Sequelize.col("monthStart")
);

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
                    [Op.not]: null
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
                    [Op.not]: null
                }
            },
        });

        // total reservations
        totals.totalReservation = await Pipelines.count({
            where: {
                reservedAt: {
                    [Op.not]: null
                },
            }
        });

        // total applied
        const totalApplied = await Pipelines.count({
            where: {
                appliedAt: {
                    [Op.not]: null
                }
            }
        });

        // total approved
        const totalApproved = await Pipelines.count({
            where: {
                approvedAppliedAt: {
                    [Op.not]: null
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
        const { year: selectedYear, month: selectedMonth } = parseDashboardMonthYear(monthYear);
        const groupedTransactions = await Pipelines.findAll({
            attributes: [
                [Sequelize.fn("TRIM", Sequelize.col("transaction")), "transaction"],
                [Sequelize.fn("COUNT", Sequelize.col("id")), "total"]
            ],
            where: {
                transaction: {
                    [Op.not]: null
                },
                [Op.and]: [
                    Sequelize.where(Sequelize.fn("YEAR", dashboardReportDateExpression), selectedYear),
                    Sequelize.where(Sequelize.fn("MONTH", dashboardReportDateExpression), selectedMonth)
                ]
            },
            group: [Sequelize.fn("TRIM", Sequelize.col("transaction"))],
            raw: true
        });

        const paymentTotals = {
            Cash: 0,
            Financing: 0,
            "Bank PO": 0
        };

        groupedTransactions.forEach((item) => {
            const rawTransaction = typeof item.transaction === "string" ? item.transaction.trim().toUpperCase() : "";
            const normalizedTransaction = paymentTermLabelMap[rawTransaction];

            if (!normalizedTransaction) {
                return;
            }

            paymentTotals[normalizedTransaction] += Number(item.total) || 0;
        });

        return {
            success: true,
            paymentTerm: [
                { name: 'Cash', data: paymentTotals.Cash },
                { name: 'Financing', data: paymentTotals.Financing },
                { name: 'Bank PO', data: paymentTotals["Bank PO"] }
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
        const { year: selectedYear, month: selectedMonth } = parseDashboardMonthYear(monthYear);

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
                            [Op.not]: null
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

        const currentYear = parseDashboardYear(selectedYear);
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

        const currentYear = parseDashboardYear(selectedYear);

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
