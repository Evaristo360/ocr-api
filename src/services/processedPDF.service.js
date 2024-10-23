const { sequelize } = require('../libs/sequelize');
const { models } = sequelize;

class ProcessedPDFService {

  constructor() { }
  async findByIdPDFFile(idPdfFile) {
    const res = await models.ProcessedPDF.findOne({ where: { idPDFFile: idPdfFile }});
    return res;
  }

  async create(data,t) {
    const res = await models.ProcessedPDF.create(data, { transaction: t });
    return res;
  }
}

module.exports = ProcessedPDFService;