import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";
import { TeamMembers } from "../models/index.js";

export const ensureTeamManagementSchema = async () => {
    const queryInterface = sequelize.getQueryInterface();
    const pipelineTable = await queryInterface.describeTable("pipelines");

    await TeamMembers.sync();

    if (!pipelineTable.memberId) {
        await queryInterface.addColumn("pipelines", "memberId", {
            type: DataTypes.INTEGER,
            allowNull: true
        });
    }
};
