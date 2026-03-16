import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Units = sequelize.define('unit', {
    variantId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    paranoid: true
});

export default Units;
