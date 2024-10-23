const { Model, DataTypes } = require('sequelize');

const DELIVERED_TABLE = 'delivered';

class Delivered extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: DELIVERED_TABLE,
            modelName: 'Delivered',
            timestamps: false
        }
    }
}

const DeliveredSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    dt: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'dt'
    },
    total: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'total'
    },
    date: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'date'
    }
}

module.exports = { Delivered, DeliveredSchema };