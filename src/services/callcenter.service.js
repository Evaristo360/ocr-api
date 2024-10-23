const { sequelize, Op } = require('../libs/sequelize');
const { models } = sequelize;

class CallCenterService {

  constructor() { }

  async create(data, t) {
    const res = await models.CallCenter.create(data, { transaction: t });
    return res;
  }


  async getResumeTableByDate(date) {
    const now = date;
    now.setHours(18, 0, 0, 0);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(18, 0, 0, 0); // set time to 18:00:00 default database sum +06:00:00

    const res = await sequelize.query(`
    SELECT 
    COUNT(CASE WHEN cc.q1 THEN 1 END) AS q1,
    COUNT(CASE WHEN cc.q2 THEN 1 END) AS q2,
    COUNT(CASE WHEN cc.q3 THEN 1 END) AS q3,
    COUNT(*) AS Total
    FROM 
    "callCenter" cc
    WHERE 
    cc."createdDate" >= :today and
    cc."createdDate" < :tomorrow 
    `, {
      replacements: {
        today: now.toISOString(),
        tomorrow: tomorrow.toISOString() // convert to ISO string for SQL
      }
    });

    return res;
  }

  async getResumeTable() {
    const res = await sequelize.query(`
    SELECT 
    COUNT(CASE WHEN cc.q1 THEN 1 END) AS q1,
    COUNT(CASE WHEN cc.q2 THEN 1 END) AS q2,
    COUNT(CASE WHEN cc.q3 THEN 1 END) AS q3,
    COUNT(*) AS Total
    FROM 
    "callCenter" cc
    `);

    return res;
  }
}

module.exports = CallCenterService;