const { sequelize, Op } = require('../libs/sequelize');
const { models } = sequelize;
const { STATUS_LOADED, STATUS_EDITING, STATUS_PROCESSED } = require('../enum/statusEnum');

class PDFFilesService {

  constructor() { }
  async findFileById(id) {
    const res = await models.PDFFile.findByPk(id);
    return res;
  }

  async findFileToEdit(date) {
    const res = await models.PDFFile.findOne({
      where: {
        [Op.or]: [
          { idStatus: STATUS_PROCESSED },
          {
            [Op.and]: [
              { idStatus: STATUS_EDITING },
              {
                //1:26<=1:25
                //1:26>=1:25
                editDate: {
                  [Op.lte]: date
                }
              }
            ]
          }
        ]
      }
    });
    return res;
  }

  async findFileToProcess() {
    const res = await models.PDFFile.findOne({
      where: { idStatus: STATUS_LOADED },
      order: [['id', 'DESC']]  // Ordena por el campo 'id' en orden descendente
    });
    return res;
  }

  async findAllDigitalized() {
    const res = await sequelize.query(`select sum(statusTotal.total_documents_waiting) as totalDigitalized from (
      SELECT catstatus."status" AS status_name,
          COUNT(pfiles.*) AS total_documents_waiting
          FROM "ppdfFiles" AS pfiles
          JOIN "catStatus" AS catstatus ON pfiles."idStatus" = catstatus."id"
          WHERE pfiles."idStatus" IN (1, 2, 3, 4, 5 )
          GROUP BY catstatus."status"
      ) statusTotal`);

    return res;
  }

  async getTotalSaved(date) {
    const currentDate = date;
    const tomorrow = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(18, 0, 0, 0); // set time to 18:00:00 default database sum +06:00:00

    const res = await sequelize.query(
      `select count(*) as total from "ppdfFiles" where "idStatus"=5 and "saveDate"< :tomorrow`
      , {
        replacements: {
          tomorrow: tomorrow.toISOString() // convert to ISO string for SQL
        }
      });

    return res;
  }

  async create(data, t) {
    const res = await models.PDFFile.create(data, { transaction: t });
    return res;
  }

  async update(id, data, t) {
    const res = await models.PDFFile.update(data, {
      where: {
        id: id
      },
      transaction: t
    });
    return res;
  }

}

module.exports = PDFFilesService;