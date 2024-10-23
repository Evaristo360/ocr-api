const { sequelize } = require('../libs/sequelize');
const { models } = sequelize;

class InstallationMinutesService {

  constructor() { }

  async findOneByidCommittee(idCommittee) {
    const res = await models.InstallationMinute.findOne({ where: { idCommittee: idCommittee } });
    return res;
  }

  async update(id, data, t) {
    const res = await models.InstallationMinute.update(data, {
      where: {
        id: id
      },
      transaction: t
    });
    return res;
  }

  async create(data, t) {
    const res = await models.InstallationMinute.create(data, { transaction: t });
    return res;
  }

}

module.exports = InstallationMinutesService;