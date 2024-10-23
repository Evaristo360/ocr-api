const { sequelize } = require('../libs/sequelize');
const { models } = sequelize;

class CatStatusService { 
  
    constructor() {}

    async findOne(id) {
      const res = await models.CatStatus.findByPk(id);
      return res;
    }
  
  }

  module.exports = CatStatusService;