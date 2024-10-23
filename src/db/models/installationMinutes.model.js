const { Model, DataTypes, Sequelize } = require('sequelize');

const INSTALLATION_MINUTES_TABLE = 'installationMinutes';

class InstallationMinute extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: INSTALLATION_MINUTES_TABLE,
      modelName: 'InstallationMinute',
      timestamps: false
    }
  }
}

const InstallationMinuteSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  idCommittee: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'idCommittee'
  },
  dateMinute: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'dateMinute'
  },
  entity: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'entity'
  },
  state: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'state'
  },
}

module.exports = { InstallationMinute, InstallationMinuteSchema };