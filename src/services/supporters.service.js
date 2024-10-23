const { sequelize } = require('../libs/sequelize');
const { models } = sequelize;

class SupportersService {

  constructor() { }

  async findAllByidCommittee(idCommittee) {
    const res = await models.Supporter.findAll({
      where: {
        idCommittee: idCommittee
      },
      order: [
        ['id', 'ASC'],
      ]
    });
    return res;
  }

  async update(id, data, t) {
    const res = await models.Supporter.update(data, {
      where: {
        id: id
      },
      transaction: t
    });
    return res;
  }

  async create(data, t) {
    const res = await models.Supporter.create(data, { transaction: t });
    return res;
  }

}

module.exports = SupportersService;