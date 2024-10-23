const { sequelize } = require('../libs/sequelize');
const { models } = sequelize;

class UsersService { 
  
    constructor() {}

    async create(data) {
      const res = await models.User.create(data);
      return res;
    }

    async findOneUsername(username) {
      const res = await models.User.findOne({ where: { username: username } });
      return res;
    }

    async update(id, data) {
      const res = await models.User.update(data, {
        where: {
          id: id
        }
      });
      return res;
    }
  
  }
  
  module.exports = UsersService;