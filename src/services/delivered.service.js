const { sequelize, Op } = require('../libs/sequelize');
const { models } = sequelize;

class DeliveredService {

  constructor() { }

  async getTotalDelivered(date) {
    const currentDate = date;
    const tomorrow = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(18, 0, 0, 0); // set time to 18:00:00 default database sum +06:00:00

    const res = await sequelize.query(
      `select sum(delivered.total) as total from delivered where delivered.date< :tomorrow`
      , {
        replacements: {
          tomorrow: tomorrow.toISOString() // convert to ISO string for SQL
        }
      });

    return res;
  }


}

module.exports = DeliveredService;