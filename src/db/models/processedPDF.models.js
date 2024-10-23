const { Model, DataTypes, Sequelize } = require('sequelize');

const PROCESSEDPDF_TABLE = 'processedPDF';

class ProcessedPDF extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: PROCESSEDPDF_TABLE,
            modelName: 'ProcessedPDF',
            timestamps: false
        }
    }
}

const ProcessedPDFSchema = {
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
    dataS3: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'dataS3'
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

module.exports = { ProcessedPDF, ProcessedPDFSchema };