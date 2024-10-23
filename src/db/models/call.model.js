const { Model, DataTypes } = require('sequelize');

const CALLS_TABLE = 'calls';

class Call extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: CALLS_TABLE,
            modelName: 'Call',
            timestamps: false
        }
    }
}

const CallSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    cellphone: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'cellphone'
    },
    sid: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'sid'
    },
    status: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'status'
    }
}

module.exports = { Call, CallSchema };