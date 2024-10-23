const { sequelize } = require('../libs/sequelize');
const { models } = sequelize;

class CallsService {

  constructor() { }

  async create(data) {
    const res = await models.Call.create(data);
    return res;
  }

  async findOneCellphone(cellphone) {
    const res = await models.Call.findOne({ where: { cellphone: cellphone } });
    return res;
  }

  async findCellphonesWithNullStatus() {
    const res = await models.Call.findAll({
      where: { status: null },
      limit: 30,
      order: [['id', 'ASC']]  // Opcional: Ordenar por 'createdAt' en orden ascendente
    });
    return res;
  }

  async updateByCellphone(cellphone, data) {
    const res = await models.Call.update(data, {
      where: {
        cellphone: cellphone
      }
    });
    return res;
  }

  async updateStatus(sid, data) {
    const res = await models.Call.update(data, {
      where: {
        sid: sid
      }
    });
    return res;
  }

  async update(id, data) {
    const res = await models.Call.update(data, {
      where: {
        id: id
      }
    });
    return res;
  }

}

module.exports = CallsService;