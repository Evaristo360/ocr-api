const { sequelize, Op } = require('../libs/sequelize');
const { models } = sequelize;

class SectionsService {

  constructor() { }

  async findAll() {
    const res = await sequelize.query(` select totalCO.section, dt.dt, dt."name", totalCO.total  from sections se 
    RIGHT join ( 
      select co.section,count(*) as total from committees co group by co.section 
    ) totalCO on totalCO.section = se.section
    LEFT join dt on dt.dt = se.dt`);
    return res;
  }


  async findByDate(date) {
    const now = date;
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(18, 0, 0, 0); // set time to 18:00:00 default database sum +06:00:00

    const res = await sequelize.query(`
    SELECT 
      totalCO.section, 
      dt.dt, 
      dt."name", 
      totalCO.comites,
	   totalCO.personas
    FROM 
      sections se 
    RIGHT JOIN (
      SELECT 
        co.section, 
        COUNT(*) AS comites,
		sum(support.personas) as personas
      FROM 
        committees co 
		inner join (
		SELECT 
        sf."idCommittee", 
        COUNT(*) personas 
      FROM 
        "supportersFinal" sf 
      GROUP BY 
         sf."idCommittee"
		) support on support."idCommittee" = co.id
      WHERE 
        co."createdDate" < :tomorrow 
      GROUP BY 
        co.section
    ) totalCO ON totalCO.section = se.section
    LEFT JOIN dt ON dt.dt = se.dt
    order by dt.dt asc
	
  `, {
      replacements: {
        tomorrow: tomorrow.toISOString() // convert to ISO string for SQL
      }
    });
    return res;
  }

  async findByDateGroup(date) {
    const now = date;
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(18, 0, 0, 0); // set time to 18:00:00 default database sum +06:00:00

    const res = await sequelize.query(`
    SELECT 
    dt.dt, 
    dt."name", 
    sum (totalCO.total)  as comites
    FROM 
      sections se 
    RIGHT JOIN (
      SELECT 
        co.section, 
        COUNT(*) AS total 
      FROM 
        committees co 
      WHERE 
        co."createdDate" < :tomorrow 
      GROUP BY 
        co.section
    ) totalCO ON totalCO.section = se.section
    LEFT JOIN dt ON dt.dt = se.dt
    GROUP BY dt.dt, dt.name
    order by dt.dt asc
  `, {
      replacements: {
        tomorrow: tomorrow.toISOString() // convert to ISO string for SQL
      }
    });
    return res;
  }

  async findReceivedAndDelivered(date) {
    const now = date;
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(18, 0, 0, 0);// set time to 18:00:00 default database sum +06:00:00

    const res = await sequelize.query(`
    select s.dt,dt.name, rec.receiver, del.deliver from sections s 
    left join (
    select d.dt, sum(d.total) as deliver from delivered d where d.date < :tomorrow group by d.dt
    ) del on del.dt = s.dt
    left join (
    select r.dt,sum(r.total) as receiver from received r where r.date < :tomorrow group by r.dt
    ) rec on rec.dt = s.dt
	  inner join dt on dt.dt = s.dt
    group by s.dt,dt.name, rec.receiver, del.deliver
    order by s.dt asc
    `, {
      replacements: {
        tomorrow: tomorrow.toISOString() // convert to ISO string for SQL
      }
    });
    return res;
  }


  async getResumeCallcenter() {
    const res = await sequelize.query(`
    select 
    se.dt,
    dt.name,
    sum(ts.Contestaron) as Contestaron,
    sum(ts.NoExiste) as NoExiste, 
    sum(ts.NoContestaron) as NoContestaron, 
    sum(ts.Repetidos) as Repetidos,
    sum(ts.Total) as Total
    from sections se
    RIGHT join (
      select 
        co.section,
        sum(sf.Contestaron) as Contestaron, 
        sum(sf.NoExiste) as NoExiste, 
        sum(sf.NoContestaron) as NoContestaron,
        sum(sf.Repetidos) as Repetidos,
        sum(sf.Total) AS Total
      from committees co 
      inner join (
      select 
        sf."idCommittee",
        COUNT(CASE WHEN sf."idStatus" = 5 THEN 1 END) AS Contestaron,
        COUNT(CASE WHEN sf."idStatus" = 6 THEN 1 END) AS NoExiste,
        COUNT(CASE WHEN sf."idStatus" = 7 THEN 1 END) AS NoContestaron,  
        COUNT(CASE WHEN sf."idStatus" = 8 THEN 1 END) AS Repetidos,
        COUNT(CASE WHEN sf."idStatus" in (5,6,7,8) THEN 1 END) AS Total
        --COUNT(*) AS Total
        from "supportersFinal" sf 
        group by sf."idCommittee"
      ) sf on sf."idCommittee"=co.id
      group by co.section
    ) ts on ts.section= se.section
    left join dt on dt.dt = se.dt
    group by se.dt,dt.name
    order by se.dt
    `);
    return res;
  }
}

module.exports = SectionsService;