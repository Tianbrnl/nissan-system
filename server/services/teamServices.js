import Teams from "../models/Team.js";
import { Pipelines, TeamMembers } from "../models/index.js";
import { sequelize } from "../config/sequelize.js";
import { capitalizeEachWord, removeUnnecessarySpaces } from "../utils/format.js";
import { Op } from "sequelize";

const RELEASE_COUNT_STATUSES = ["Sold", "For Release"];

const normalizeMemberPayload = (members = []) => {
    if (!Array.isArray(members)) {
        return [];
    }

    return members
        .map((member) => {
            if (typeof member === "string") {
                return {
                    id: null,
                    memberName: member
                };
            }

            return {
                id: member?.id ?? null,
                memberName: member?.memberName ?? ""
            };
        })
        .map((member) => ({
            ...member,
            memberName: capitalizeEachWord(removeUnnecessarySpaces(member.memberName || ""))
        }))
        .filter((member) => member.memberName);
};

const validateMembers = (members) => {
    const memberNames = members.map((member) => member.memberName.toLowerCase());
    const uniqueNames = new Set(memberNames);

    if (uniqueNames.size !== memberNames.length) {
        return "Member names must be unique within the same team.";
    }

    return "";
};

const formatTeamSummary = (team) => {
    const members = (team.members || []).map((member) => {
        const salesCount = member.pipelines?.length || 0;

        return {
            id: member.id,
            memberName: member.memberName,
            salesCount,
            status: salesCount === 0 ? "No Release" : "Active"
        };
    });

    const noSalesCount = members.filter((member) => member.salesCount === 0).length;

    return {
        id: team.id,
        teamCode: team.teamCode,
        teamLeader: team.teamLeader,
        members,
        membersCount: members.length,
        noSalesCount
    };
};

const getMonthDateRange = (monthYear) => {
    if (!monthYear || !/^\d{4}-\d{2}$/.test(monthYear)) {
        return null;
    }

    const [year, month] = monthYear.split("-").map(Number);

    if (!year || !month || month < 1 || month > 12) {
        return null;
    }

    const monthStart = new Date(Date.UTC(year, month - 1, 1));
    const monthEnd = new Date(Date.UTC(year, month, 0));

    return {
        monthStart: monthStart.toISOString().slice(0, 10),
        monthEnd: monthEnd.toISOString().slice(0, 10)
    };
};

const buildTeamInclude = (monthYear) => {
    const monthDateRange = getMonthDateRange(monthYear);

    return [
    {
        model: TeamMembers,
        as: "members",
        attributes: ["id", "memberName"],
        required: false,
        include: [
            {
                model: Pipelines,
                as: "pipelines",
                attributes: ["id"],
                required: false,
                ...(monthDateRange
                    ? {
                        where: {
                            status: {
                                [Op.in]: RELEASE_COUNT_STATUSES
                            },
                            targetReleased: {
                                [Op.between]: [monthDateRange.monthStart, monthDateRange.monthEnd]
                            }
                        }
                    }
                    : {})
            }
        ]
    }
];
};

// CREARE TEAM
export const createTeamService = async (teamCode, teamLeader, members = []) => {
    try {
        if (!teamCode.trim() || !teamLeader.trim()) {
            return {
                success: false,
                message: "Please complete all fields to proceed with account creation."
            };
        }

        const formattedTeamLeader = capitalizeEachWord(
            removeUnnecessarySpaces(teamLeader)
        );
        const normalizedMembers = normalizeMemberPayload(members);
        const memberValidationMessage = validateMembers(normalizedMembers);

        if (memberValidationMessage) {
            return {
                success: false,
                message: memberValidationMessage
            };
        }

        const team = await Teams.create({
            teamCode,
            teamLeader: formattedTeamLeader
        });

        if (normalizedMembers.length > 0) {
            await TeamMembers.bulkCreate(
                normalizedMembers.map((member) => ({
                    memberName: member.memberName,
                    teamId: team.id
                }))
            );
        }

        return {
            success: true,
            message: "Team created successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// READ ONE TEAM
export const readOneTeamService = async (teamId) => {
    try {
        if (!teamId.trim()) {
            return {
                success: false,
                message: "Team ID required."
            };
        }

        const team = await Teams.findByPk(teamId, {
            attributes: ['id', 'teamCode', 'teamLeader'],
            include: buildTeamInclude()
        });

        if (!team) {
            return {
                success: false,
                message: "Team not found."
            };
        }

        return {
            success: true,
            team: formatTeamSummary(team.get({ plain: true }))
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// READ ALL TEAM
export const readAllTeamService = async (monthYear) => {
    try {
        const teams = await Teams.findAll({
            attributes: ['id', 'teamCode', 'teamLeader'],
            include: buildTeamInclude(monthYear),
            order: [
                ['teamCode', 'ASC'],
                [{ model: TeamMembers, as: 'members' }, 'memberName', 'ASC']
            ]
        });

        if (!teams) {
            return {
                success: false,
                message: "Teams not found."
            };
        }

        return {
            success: true,
            teams: teams.map((team) => formatTeamSummary(team.get({ plain: true })))
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// READ ALL GRM
export const readAllGrmService = async () => {
    try {

        const grms = await Teams.findAll({
            attributes: ['id', 'teamLeader'],
        });

        if (!grms) {
            return {
                success: false,
                models: []
            };
        }

        const formatedGRMs = grms.map(grm => ({ value: grm.id, name: grm.teamLeader }));

        return {
            success: true,
            grms: formatedGRMs
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

export const readTeamMembersService = async (teamId) => {
    try {
        if (!teamId?.trim()) {
            return {
                success: false,
                message: "Team ID required."
            };
        }

        const members = await TeamMembers.findAll({
            where: { teamId },
            attributes: ["id", "memberName"],
            order: [["memberName", "ASC"]]
        });

        return {
            success: true,
            members: members.map((member) => ({
                value: member.id,
                name: member.memberName
            }))
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// UPDATE TEAM
export const updateTeamService = async (teamId, teamCode, teamLeader, members = []) => {
    try {
        if (!teamCode.trim() || !teamLeader.trim()) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        const formattedTeamLeader = capitalizeEachWord(
            removeUnnecessarySpaces(teamLeader)
        );
        const normalizedMembers = normalizeMemberPayload(members);
        const memberValidationMessage = validateMembers(normalizedMembers);

        if (memberValidationMessage) {
            return {
                success: false,
                message: memberValidationMessage
            };
        }

        await sequelize.transaction(async (transaction) => {
            await Teams.update({
                teamCode,
                teamLeader: formattedTeamLeader
            }, {
                where: { id: teamId },
                transaction
            });

            const existingMembers = await TeamMembers.findAll({
                where: { teamId },
                attributes: ["id", "memberName"],
                transaction
            });

            const existingMap = new Map(existingMembers.map((member) => [String(member.id), member]));
            const submittedIds = new Set(
                normalizedMembers
                    .map((member) => member.id)
                    .filter((memberId) => memberId !== null && memberId !== undefined)
                    .map((memberId) => String(memberId))
            );

            for (const member of normalizedMembers) {
                if (member.id && existingMap.has(String(member.id))) {
                    await TeamMembers.update({
                        memberName: member.memberName
                    }, {
                        where: {
                            id: member.id,
                            teamId
                        },
                        transaction
                    });
                    continue;
                }

                await TeamMembers.create({
                    memberName: member.memberName,
                    teamId
                }, { transaction });
            }

            const removedMembers = existingMembers.filter((member) => !submittedIds.has(String(member.id)));

            if (removedMembers.length > 0) {
                const removedMemberIds = removedMembers.map((member) => member.id);
                const linkedPipelines = await Pipelines.count({
                    where: {
                        memberId: removedMemberIds
                    },
                    transaction
                });

                if (linkedPipelines > 0) {
                    throw new Error("Members with linked pipeline records cannot be removed.");
                }

                await TeamMembers.destroy({
                    where: {
                        id: removedMemberIds
                    },
                    transaction
                });
            }
        });

        return {
            success: true,
            message: "Team updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// DELETE TEAM 
export const deleteTeamService = async (teamId) => {
    try {
        const affectedRows = await Teams.destroy({
            where: { id: teamId }
        });

        if (affectedRows === 0) {
            return {
                success: false,
                message: 'Team not found'
            };
        }

        return {
            success: true,
            message: 'Team deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};
