import { createTeamService, deleteTeamService, readAllGrmService, readAllTeamService, readOneTeamService, readTeamMembersService, updateTeamService } from "../services/teamServices.js";

// CREATE TEAM 
export const createTeamController = async (req, res) => {
    try {
        const { teamCode, teamLeader, members } = req.body;
        const result = await createTeamService(teamCode, teamLeader, members);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// READ TEAM MEMBERS
export const readTeamMembersController = async (req, res) => {
    try {
        const { teamId } = req.params;
        const result = await readTeamMembersService(teamId);

        return res.json(result);
    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// READ ONE TEAM 
export const readOneTeamController = async (req, res) => {
    try {
        const { teamId } = req.params;
        const result = await readOneTeamService(teamId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// READ ALL TEAM 
export const readAllTeamController = async (req, res) => {
    try {
        const result = await readAllTeamService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// READ ALL GRM 
export const readAllGrmController = async (req, res) => {
    try {
        const result = await readAllGrmService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// UPDATE TEAM 
export const updateTeamController = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { teamCode, teamLeader, members } = req.body;
        const result = await updateTeamService(teamId, teamCode, teamLeader, members);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// DELETE TEAM 
export const deleteTeamController = async (req, res) => {
    try {
        const { teamId } = req.params;
        const result = await deleteTeamService(teamId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}
