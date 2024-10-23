const { Model, DataTypes, Sequelize } = require('sequelize');

const SUPPORTERS_TABLE = 'supporters';

class Supporter extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: SUPPORTERS_TABLE,
      modelName: 'Supporter',
      timestamps: false
    }
  }
}

const SupporterSchema = {
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
  lastName: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'materno'
  },
  mothersLastname: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'mothersLastname'
  },
  name: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'name'
  },
  type: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'type'
  },
  address: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'address'
  },
  neighborhood: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'neighborhood '
  },
  city: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'city '
  },
  entity: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'entity '
  },
  zipCode: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'zipCode'
  },
  electorKey: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'electorKey '
  },
  telephone: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'telephone'
  },
  curp: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'curp '
  },
  cellphone: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'cellphone'
  },
  whatsapp: {
    allowNull: true,
    type: DataTypes.BOOLEAN,
    field: 'whatsapp'
  },
  email: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'email'
  },
  facebook: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'facebook '
  },
  demarcacion: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'demarcacion '
  },
  cond: {
    allowNull: true,
    type: DataTypes.CHAR,
    field: 'cond'
  }
}

module.exports = { Supporter, SupporterSchema };