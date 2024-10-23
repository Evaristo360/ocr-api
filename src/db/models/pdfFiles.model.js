const { Model, DataTypes, Sequelize } = require('sequelize');

const PDFFILES_TABLE = 'ppdfFiles';

class PDFFile extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: PDFFILES_TABLE,
      modelName: 'PDFFile',
      timestamps: false
    }
  }
}

const PDFFileSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  urlFile: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'urlFile'
  },
  nameFile: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'nameFile'
  },
  versionId: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'versionId'
  },
  idStatus: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'idStatus'
  },
  uploadDate: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'uploadDate'
  },
  processDate: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'processDate'
  },
  editDate: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'editDate'
  },
  saveDate: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'saveDate'
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

module.exports = { PDFFile, PDFFileSchema };