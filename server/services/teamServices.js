import Teams from "../models/Team.js";
import { capitalizeEachWord, removeUnnecessarySpaces } from "../utils/format.js";

// CREARE TEAM
export const createTeamService = async (teamCode, teamLeader) => {
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

        // Create user
        const user = await Teams.create({
            teamCode,
            teamLeader: formattedTeamLeader
        });

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
            attributes: ['teamCode', 'teamLeader'],
        });

        if (!team) {
            return {
                success: false,
                message: "Team not found."
            };
        }

        return {
            success: true,
            team
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// READ ALL TEAM
export const readAllTeamService = async () => {
    try {

        const teams = await Teams.findAll({
            attributes: ['id', 'teamCode', 'teamLeader'],
        });

        if (!teams) {
            return {
                success: false,
                message: "Teams not found."
            };
        }

        return {
            success: true,
            teams
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

// UPDATE TEAM
export const updateTeamService = async (teamId, teamCode, teamLeader) => {
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

        // Create user
        await Teams.update({
            teamCode,
            teamLeader: formattedTeamLeader
        }, {
            where: { id: teamId }
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