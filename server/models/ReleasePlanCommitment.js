import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const ReleasePlanCommitments = sequelize.define("release_plan_commitment", {
    team: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    reportDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    monthEnd: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    paranoid: true,
    indexes: [
        {
            unique: true,
            fields: ["team", "reportDate"]
        }
    ]
});

export default ReleasePlanCommitments;
