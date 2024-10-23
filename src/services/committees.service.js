const { sequelize } = require('../libs/sequelize');
const { models } = sequelize;

class CommitteesService {

  constructor() { }
  async findOneById(id) {
    const res = await models.Committee.findByPk(id);
    return res;
  }
  async findOneByFolio(folio) {
    const res = await models.Committee.findOne({ where: { folio: folio } });
    return res;
  }

  async findOneByidPDFFile(idPDFFile) {
    const res = await models.Committee.findOne({ where: { idPDFFile: idPDFFile } });
    return res;
  }

  async create(data, t) {
    const res = await models.Committee.create(data, { transaction: t });
    return res;
  }

  async update(id, data, t) {
    const res = await models.Committee.update(data, {
      where: {
        id: id
      }, 
      transaction: t
    });
    return res;
  }

}

module.exports = CommitteesService;