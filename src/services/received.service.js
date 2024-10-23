const { sequelize, Op } = require('../libs/sequelize');
const { models } = sequelize;

class ReceivedService {

  constructor() { }

  async findOneByDtAndDate(dt, date) {
    const now = date;
    // const now = new Date(2024, 4, 8);
    const tomorrowAdd = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const today = now.setHours(18, 0, 0, 0); // set time to 18:00:00 default database sum +06:00:00
    const tomorrow = tomorrowAdd.setHours(18, 0, 0, 0); // set time to 18:00:00 default database sum +06:00:00

    const res = await models.Received.findAll({
      where: {
        [Op.and]: [
          {
            dt: dt
          },
          {
            date: {
              [Op.gte]: today,
              [Op.lt]: tomorrow
            }
          }
        ]
      }
    });
    return res;
  }


  async findAllByDate(date) {
    const now = date;
    // const now = new Date(2024, 4, 8);
    const tomorrowAdd = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const today = now.setHours(18, 0, 0, 0); // set time to 18:00:00 default database sum +06:00:00
    const tomorrow = tomorrowAdd.setHours(18, 0, 0, 0); // set time to 18:00:00 default database sum +06:00:00

    const res = await models.Received.findAll({
      where: {
        date: {
          // [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      }
    });
    return res;
  }

}

module.exports = ReceivedService;