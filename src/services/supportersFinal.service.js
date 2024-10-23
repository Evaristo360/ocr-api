const { sequelize, Op } = require('../libs/sequelize');
const { models } = sequelize;
const { STATUS_PROCESSED } = require('../enum/statusEnum');

class SupportersFinalService {

  constructor() { }

  async create(data, t) {
    const res = await models.SupporterFinal.create(data, { transaction: t });
    return res;
  }

  async findOneById(id) {
    const res = await models.SupporterFinal.findByPk(id);
    return res;
  }

  async findSupporterToRespondent(dt) {
    let query = `select sf.*, se.dt, co.section from "supportersFinal" sf 
    inner join committees co on co.id = sf."idCommittee"
    left join sections se on se.section = co.section
    where sf."idStatus" is NULL and se.dt = :dt`;
    if (dt == null) {
      query = `select sf.*, se.dt, co.section from "supportersFinal" sf 
      inner join committees co on co.id = sf."idCommittee"
      left join sections se on se.section = co.section
      where sf."idStatus" is NULL`
    }
    const res = await sequelize.query(query, {
      replacements: {
        dt: dt
      }
    });

    return res;
  }

  async findSupporterByCellphone(cell) {
    const res = await models.SupporterFinal.findOne({
      where: {
        [Op.and]: [
          {
            idStatus: {
              [Op.not]: null, // Like: sellDate IS NOT NULL
            }
          },
          {
            //1:26<=1:25
            //1:26>=1:25
            cellphone: cell
          }
        ]
      }
    });
    return res;
  }

  async getTotal() {
    const res = await sequelize.query(`select count(*) as total from "supportersFinal"`);

    return res;
  }

  async getResumeTableByDate(date) {
    const now = date;
    now.setHours(18, 0, 0, 0);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(18, 0, 0, 0); // set time to 18:00:00 default database sum +06:00:00

    const res = await sequelize.query(`
    SELECT 
    COUNT(CASE WHEN sf."idStatus" = 5 THEN 1 END) AS Contestaron,
    COUNT(CASE WHEN sf."idStatus" = 6 THEN 1 END) AS NoExiste,
    COUNT(CASE WHEN sf."idStatus" = 7 THEN 1 END) AS NoContestaron,  
    COUNT(CASE WHEN sf."idStatus" = 8 THEN 1 END) AS Repetidos,
    COUNT(CASE WHEN sf."idStatus" in (5,6,7,8) THEN 1 END) AS Total
  FROM 
    "supportersFinal" sf
    WHERE 
    sf."editDate" >= :today and
    sf."editDate" < :tomorrow 
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
    COUNT(CASE WHEN sf."idStatus" = 5 THEN 1 END) AS Contestaron,
    COUNT(CASE WHEN sf."idStatus" = 6 THEN 1 END) AS NoExiste,
    COUNT(CASE WHEN sf."idStatus" = 7 THEN 1 END) AS NoContestaron,  
    COUNT(CASE WHEN sf."idStatus" = 8 THEN 1 END) AS Repetidos,
    COUNT(CASE WHEN sf."idStatus" in (5,6,7,8) THEN 1 END) AS Total
  FROM 
    "supportersFinal" sf
    `);

    return res;
  }

  async update(id, data, t) {
    const res = await models.SupporterFinal.update(data, {
      where: {
        id: id
      },
      transaction: t
    });
    return res;
  }
}

module.exports = SupportersFinalService;