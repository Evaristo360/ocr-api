const { sequelize } = require('../libs/sequelize');
const { models } = sequelize;

class HistoryService { 
  
    constructor() {}

    async create(data, t) {
      const res = await models.History.create(data, { transaction: t });
      return res;
    }
  
  }
  
  module.exports = HistoryService;