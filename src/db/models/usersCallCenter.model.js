const { Model, DataTypes } = require('sequelize');

const USER_CALL_CENTER_TABLE = 'usersCallCenter';

class UserCallCenter extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: USER_CALL_CENTER_TABLE,
            modelName: 'UserCallCenter',
            timestamps: false
        }
    }
}

const UserCallCenterSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'name'
    },
    lastname: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'lastname'
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'email'
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'password'
    },
    createdDate: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'createdDate'
    },
    lastLogin: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'lastLogin'
    },
    dt: {
        allowNull: true,
        type: DataTypes.INTEGER,
        field: 'dt'
    }
}

module.exports = { UserCallCenter, UserCallCenterSchema };