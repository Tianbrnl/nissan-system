import { Pipelines, Teams } from "../models/index.js";
import { Sequelize } from "sequelize";

// TEAM PERFORMANCE
export const teamPerformanceService = async (monthYear) => {
    try {
        // split monthYear into year and month
        const [year, month] = monthYear.split("-").map(Number);

        const teamPerformance = await Pipelines.findAll({
            attributes: [
                "teamId",

                // team info
                [
                    Sequelize.literal(`CONCAT(team.teamCode, ' - ', team.teamLeader)`),
                    "team"
                ],

                // applications
                [
                    Sequelize.fn(
                        "COUNT",
                        Sequelize.literal(`CASE WHEN YEAR(appliedAt) = ${year} AND MONTH(appliedAt) = ${month} THEN 1 END`)
                    ),
                    "applications"
                ],

                [
                    Sequelize.fn(
                        "COUNT",
                        Sequelize.literal(`CASE WHEN YEAR(approvedAppliedAt) = ${year} AND MONTH(approvedAppliedAt) = ${month} THEN 1 END`)
                    ),
                    "appliedApproved"
                ],

                [
                    Sequelize.fn(
                        "COUNT",
                        Sequelize.literal(`CASE WHEN YEAR(approvedNotAppliedAt) = ${year} AND MONTH(approvedNotAppliedAt) = ${month} THEN 1 END`)
                    ),
                    "appliedNotApproved"
                ],

                [
                    Sequelize.fn(
                        "COUNT",
                        Sequelize.literal(`CASE WHEN YEAR(availedAt) = ${year} AND MONTH(availedAt) = ${month} THEN 1 END`)
                    ),
                    "availed"
                ],
            ],

            include: [
                {
                    model: Teams,
                    attributes: []
                }
            ],

            group: ["pipeline.teamId", "team.id"],
            raw: true
        });

        // calculate totals
        const totals = teamPerformance.reduce(
            (acc, curr) => {
                acc.applications += Number(curr.applications);
                acc.appliedApproved += Number(curr.appliedApproved);
                acc.appliedNotApproved += Number(curr.appliedNotApproved);
                acc.availed += Number(curr.availed);
                return acc;
            },
            {
                applications: 0,
                appliedApproved: 0,
                appliedNotApproved: 0,
                availed: 0
            }
        );

        return {
            success: true,
            teamPerformance,
            totals
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Month abbreviations in uppercase
const monthNamesShort = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

// APPLICATION & APPROVALS BY MONTH (JAN-DEC)
export const applicationsApprovalsService = async (year) => {
    try {
        // Fetch counts grouped by month
        const dbResults = await Pipelines.findAll({
            attributes: [
                [Sequelize.fn("MONTH", Sequelize.col("appliedAt")), "month"],
                [
                    Sequelize.fn(
                        "COUNT",
                        Sequelize.literal(`CASE WHEN YEAR(appliedAt) = ${year} THEN 1 END`)
                    ),
                    "applications"
                ],
                [
                    Sequelize.fn(
                        "COUNT",
                        Sequelize.literal(`CASE WHEN YEAR(approvedAppliedAt) = ${year} THEN 1 END`)
                    ),
                    "appliedApproved"
                ],
                [
                    Sequelize.fn(
                        "COUNT",
                        Sequelize.literal(`CASE WHEN YEAR(approvedNotAppliedAt) = ${year} THEN 1 END`)
                    ),
                    "appliedNotApproved"
                ],
                [
                    Sequelize.fn(
                        "COUNT",
                        Sequelize.literal(`CASE WHEN YEAR(availedAt) = ${year} THEN 1 END`)
                    ),
                    "availed"
                ],
            ],
            group: [Sequelize.fn("MONTH", Sequelize.col("appliedAt"))],
            raw: true
        });

        // Ensure all 12 months are included
        const applicationsApprovals = monthNamesShort.map((name, index) => {
            const monthData = dbResults.find(d => Number(d.month) === index + 1);
            return {
                month: name, // short uppercase month
                applications: monthData ? Number(monthData.applications) : 0,
                appliedApproved: monthData ? Number(monthData.appliedApproved) : 0,
                appliedNotApproved: monthData ? Number(monthData.appliedNotApproved) : 0,
                availed: monthData ? Number(monthData.availed) : 0,
            };
        });

        // Calculate totals
        const totals = applicationsApprovals.reduce(
            (acc, curr) => {
                acc.applications += curr.applications;
                acc.appliedApproved += curr.appliedApproved;
                acc.appliedNotApproved += curr.appliedNotApproved;
                acc.availed += curr.availed;
                return acc;
            },
            { applications: 0, appliedApproved: 0, appliedNotApproved: 0, availed: 0 }
        );

        return {
            success: true,
            applicationsApprovals,
            totals
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};