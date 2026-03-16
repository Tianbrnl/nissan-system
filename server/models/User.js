import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Users = sequelize.define('user', {
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    otpExpireAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    paranoid: true
});

export default Users;
