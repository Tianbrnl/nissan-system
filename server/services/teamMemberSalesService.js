import { Op, Sequelize } from "sequelize";
import { Pipelines, TeamMembers, Teams } from "../models/index.js";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const createEmptyMonthlyCounts = () =>
    MONTH_LABELS.map((label, index) => ({
        month: label,
        monthIndex: index,
        count: 0
    }));

export const readTeamMemberYearlySalesService = async (memberId, year) => {
    try {
        const parsedMemberId = Number(memberId);
        const parsedYear = Number(year);

        if (!parsedMemberId) {
            return {
                success: false,
                message: "Member ID required."
            };
        }

        if (!parsedYear || String(parsedYear).length !== 4) {
            return {
                success: false,
                message: "A valid year is required."
            };
        }

        const member = await TeamMembers.findByPk(parsedMemberId, {
            attributes: ["id", "memberName", "teamId"],
            include: [
                {
                    model: Teams,
                    as: "team",
                    attributes: ["id", "teamCode", "teamLeader"]
                }
            ]
        });

        if (!member) {
            return {
                success: false,
                message: "Team member not found."
            };
        }

        const sales = await Pipelines.findAll({
            attributes: [
                [Sequelize.fn("MONTH", Sequelize.col("targetReleased")), "saleMonth"],
                [Sequelize.fn("COUNT", Sequelize.col("id")), "total"]
            ],
            where: {
                memberId: parsedMemberId,
                status: "Sold",
                targetReleased: {
                    [Op.gte]: `${parsedYear}-01-01`,
                    [Op.lt]: `${parsedYear + 1}-01-01`
                }
            },
            group: [Sequelize.fn("MONTH", Sequelize.col("targetReleased"))],
            raw: true
        });

        const monthlyCounts = createEmptyMonthlyCounts();

        sales.forEach((sale) => {
            const monthIndex = Number(sale.saleMonth) - 1;

            if (monthIndex >= 0 && monthIndex < 12) {
                monthlyCounts[monthIndex].count = Number(sale.total) || 0;
            }
        });

        return {
            success: true,
            memberSales: {
                memberId: member.id,
                memberName: member.memberName,
                teamId: member.teamId,
                teamCode: member.team?.teamCode ?? null,
                teamLeader: member.team?.teamLeader ?? null,
                year: parsedYear,
                monthlyCounts,
                totalSold: monthlyCounts.reduce((sum, item) => sum + item.count, 0)
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};
