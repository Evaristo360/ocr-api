const { sequelize } = require('../libs/sequelize');
const { models } = sequelize;

class UsersCallCenterService {

  constructor() { }

  async findOneById(id) {
    const res = await models.UserCallCenter.findByPk(id);
    return res;
  }

  async create(data) {
    const res = await models.UserCallCenter.create(data);
    return res;
  }

  async findOneEmail(email) {
    const res = await models.UserCallCenter.findOne({ where: { email: email } });
    return res;
  }

  async update(id, data) {
    const res = await models.UserCallCenter.update(data, {
      where: {
        id: id
      }
    });
    return res;
  }

}

module.exports = UsersCallCenterService;