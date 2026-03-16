import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Variants = sequelize.define('variant', {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    paranoid: true
});

export default Variants;
