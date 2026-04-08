import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";
import { TeamMembers } from "../models/index.js";

export const ensureTeamManagementSchema = async () => {
    const queryInterface = sequelize.getQueryInterface();
    let pipelineTable = {};

    try {
        pipelineTable = await queryInterface.describeTable("pipelines");
    } catch (error) {
        console.log('Pipelines table not found during schema check. It should be created by sequelize.sync().');
    }

    await TeamMembers.sync();

    if (!pipelineTable.memberId) {
        await queryInterface.addColumn("pipelines", "memberId", {
            type: DataTypes.INTEGER,
            allowNull: true
        });
    }
};
