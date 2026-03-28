import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const TeamMembers = sequelize.define('team_member', {
    memberName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    teamId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    paranoid: true
});

export default TeamMembers;
