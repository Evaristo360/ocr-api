const SupportersFinalService = require('../services/supportersFinal.service');
const CallCenterFinalService = require('../services/callcenter.service');
const UsersCallCenterService = require('../services/usersCallCenter.service');
const usersCallCenterService = new UsersCallCenterService();
const supportersFinalService = new SupportersFinalService();
const callCenterService = new CallCenterFinalService();

const { sequelize } = require('../libs/sequelize');
const { config } = require('../config/config');
const { STATUS_SAVED, STATUS_EDITING, STATUS_NOT_EXIST, STATUS_REPEATED } = require('../enum/statusEnum');

const save = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            register
        } = req.body;

        //Se genera un nuevo registro
        let newRegister = {
            createdDate: new Date(),
            ...register
        }
        let registerRes = await callCenterService.create(newRegister, t);

        //Se actualiza el integrante para que ya no le vuelvan a marcar
        let supporter = supportersFinalService.findOneById(register.idSupporter);
        supporter.idStatus = register.idStatus;
        supporter.editDate = new Date();
        await supportersFinalService.update(register.idSupporter, supporter, t);

        await t.commit();
        res.status(200).send({ success: true, data: registerRes.dataValues });

    } catch (error) {
        let rollback = await t.rollback();
        console.error(new Date().toString(), " ERROR: ", error)
        res.status(500).send({ success: false, message: "Ha ocurrido un error en el servidor." });
    }
}


const getNext = async (req, res) => {
    try {
        const { idUser } = req.params;
        let userData = await usersCallCenterService.findOneById(idUser);
        if (userData != null) {
            let find = false;
            let supporter = null;
            while (!find) {
                let resultSQL = await supportersFinalService.findSupporterToRespondent(userData.dataValues.dt);
                if (resultSQL[0].length > 0) {
                    let records = resultSQL[0];
                    if (isValidDigitString(records[0].cellphone)) {
                        let existNumber = await supportersFinalService.findSupporterByCellphone(records[0].cellphone);
                        if (existNumber != null) {
                            records[0].idStatus = STATUS_REPEATED;
                        } else {
                            records[0].idStatus = STATUS_EDITING;
                            supporter = records[0]
                            find = true
                        }
                    } else {
                        records[0].idStatus = STATUS_NOT_EXIST;
                    }
                    records[0].editDate = new Date();
                    await supportersFinalService.update(records[0].id, records[0]);
                } else {
                    find = true;
                }
            }
            res.status(200).send({ success: true, data: supporter });
        } else {
            res.status(400).send({ success: false, data: "Usuario no encontrado" });
        }

    } catch (error) {
        console.error(new Date().toString(), " ERROR: ", error)
        res.status(500).send({ success: false, message: "Ha ocurrido un error en el servidor." });
    }
}

const isValidDigitString = (str) => {
    return /^\d{10}$/.test(str);
}

module.exports = {
    save,
    getNext
};
