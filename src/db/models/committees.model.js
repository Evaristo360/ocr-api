const { Model, DataTypes, Sequelize } = require('sequelize');

const COMMITTEES_TABLE = 'committees';

class Committee extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: COMMITTEES_TABLE,
      modelName: 'Committee',
      timestamps: false
    }
  }
}

const CommitteeSchema = {
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
  section: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'section'
  },
  folio: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'folio'
  },
  entity: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'entity'
  },
  city: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'city'
  },
  dateCommittee: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'dateCommittee'
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

module.exports = { Committee, CommitteeSchema }; 