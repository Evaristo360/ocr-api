const { Model, DataTypes, Sequelize } = require('sequelize');

const HISTORY_TABLE = 'history';

class History extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: HISTORY_TABLE,
      modelName: 'History',
      timestamps: false
    }
  }
}

const HistorySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  idPDFFile: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'idPDFFile'
  },
  idStatus: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'idStatus'
  },
  createdDate: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'createdDate'
  },
  user: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'user'
  },
  apiResponse: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'apiResponse'
  },
  comments: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'comments'
  }
}

module.exports = { History, HistorySchema };