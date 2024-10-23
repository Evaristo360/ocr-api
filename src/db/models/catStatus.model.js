const { Model, DataTypes, Sequelize } = require('sequelize');

const CATSATUS_TABLE = 'catStatus';

class CatStatus extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: CATSATUS_TABLE,
      modelName: 'CatStatus',
      timestamps: false
    }
  }
}

const CatStatusSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'status'
  }
}

module.exports = { CatStatus, CatStatusSchema };