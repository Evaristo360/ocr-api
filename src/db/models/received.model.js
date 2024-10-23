const { Model, DataTypes } = require('sequelize');

const RECEIVED_TABLE = 'received';

class Received extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: RECEIVED_TABLE,
            modelName: 'Received',
            timestamps: false
        }
    }
}

const ReceivedSchema = {
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

module.exports = { Received, ReceivedSchema };