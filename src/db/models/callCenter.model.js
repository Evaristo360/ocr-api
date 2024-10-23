const { Model, DataTypes } = require('sequelize');

const CALL_CENTER_TABLE = 'callCenter';

class CallCenter extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: CALL_CENTER_TABLE,
            modelName: 'CallCenter',
            timestamps: false
        }
    }
}

const CallCenterSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    age: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'age'
    },
    q1: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        field: 'q1'
    },
    q2: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        field: 'q2'
    },
    q3: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        field: 'q3'
    },
    q4: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        field: 'q4'
    },
    comments: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'comments'
    },
    idStatus: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'idStatus'
    },
    idSupporter: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'idSupporter'
    },
    idUser: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'idUser'
    },
    createdDate: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'createdDate'
    }
}

module.exports = { CallCenter, CallCenterSchema };