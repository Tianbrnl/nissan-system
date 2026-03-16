import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Teams = sequelize.define('team', {
    teamCode: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    teamLeader: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    paranoid: true
});

export default Teams;
