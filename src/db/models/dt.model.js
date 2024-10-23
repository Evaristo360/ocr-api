const { Model, DataTypes } = require('sequelize');

const DT_TABLE = 'dt';

class Dt extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: DT_TABLE,
            modelName: 'Dt',
            timestamps: false
        }
    }
}

const DtSchema = {
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
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'name'
    },
    cellphone: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'cellphone'
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'email'
    }
}

module.exports = { Dt, DtSchema };