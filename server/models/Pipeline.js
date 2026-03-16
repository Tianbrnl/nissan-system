import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Pipelines = sequelize.define('pipeline', {
    targetReleased: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    unitId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    color: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    csNumber: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    transaction: {
        type: DataTypes.ENUM('Cash', 'Bank OP', 'Financing'),
        allowNull: true,
    },
    bank: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    client: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    teamId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Sold', 'For Release', 'w/ Payment', 'For Bank Approval'),
        allowNull: true,
    },
    monthStart: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    appliedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    approvedAppliedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    approvedNotAppliedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    availedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    reservationAmount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    reservedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
}, {
    paranoid: true
});

export default Pipelines;
