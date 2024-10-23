const CommitteesService = require('../services/committees.service');
const SupportersService = require('../services/supporters.service');
const SupportersFinalService = require('../services/supportersFinal.service');
const InstallationMinutesService = require('../services/installationMinutes.service');
const PDFFilesService = require('../services/pdfFiles.service');
const HistoryService = require('../services/history.service');

const committeesService = new CommitteesService();
const supportersService = new SupportersService();
const supportersFinalService = new SupportersFinalService();
const installationMinutesService = new InstallationMinutesService();
const pdfFilesService = new PDFFilesService();
const historyService = new HistoryService();

const { sequelize } = require('../libs/sequelize');
const { config } = require('../config/config');
const { getNextEditForm } = require('../utils/commons');
const { STATUS_SAVED, STATUS_DELETE } = require('../enum/statusEnum');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const axios = require('axios');
const cos = require('../libs/cos');
const fs = require('fs');

const paramsClient = {
    region: config.awsRegion,
    credentials: {
        accessKeyId: config.awsAccessKey,
        secretAccessKey: config.awsSecretAccess,
    }
}

const s3Client = new S3Client(paramsClient);

const getDateFormat = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-GB', options).replace(/\//g, '-');
}

const saveResponseThanosServer = (data) => {
    const fileName = 'logs.txt';
    const content = new Date().toLocaleString() + " RESPONSE::: " + JSON.stringify(data) + "\n";

    // Open the file in append mode
    fs.open(fileName, 'a', (err, fd) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File does not exist, so create it
                fs.writeFile(fileName, content, (err) => {
                    if (err) throw err;
                    console.log('Log creado.');
                });
            } else {
                // Other error
                throw err;
            }
        } else {
            // File exists, so append content
            fs.appendFile(fd, content, (err) => {
                if (err) throw err;
                console.log('Log actualizado.');
            });
        }
    });
};

const updateRecords = async (idPdf, username, t, committee, supportters) => {
    //Se obtiene la información obtenida del OCR
    let pdfFile = await pdfFilesService.findFileById(idPdf)

    //Actualizamos el registro con estado  en Guardado
    let pdfFileUpdate = pdfFile.dataValues;
    pdfFileUpdate.idStatus = STATUS_SAVED;
    pdfFileUpdate.saveDate = new Date();
    pdfFileUpdate.user = username;
    pdfFileUpdate.apiResponse = 201;
    pdfFileUpdate.comments = "Guardado exitosamente"//JSON.stringify(responseThanos)
    await pdfFilesService.update(idPdf, pdfFileUpdate, t)

    const historyBody = {
        idPDFFile: idPdf,
        idStatus: STATUS_SAVED,
        createdDate: new Date(),
        apiResponse: 200
    };

    await historyService.create(historyBody, t);

    //eliminar el objecto del aws s3 
    await s3Client.send(new DeleteObjectCommand({
        Bucket: config.bucketname,
        Key: pdfFileUpdate.nameFile,
    }));
};

const save = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        if (!req.body) {
            console.error(new Date().toString(), "VALIDACIÓN: No existe información para cargar.");
            res.status(400).send({ success: false, message: "No existe información para cargar." });
            return;
        }
        const {
            idFile,
            username,
            committee,
            supporters,
            installationMinute
        } = req.body;

        //Mencionar que es guardado
        committee.apiResponse = 200;
        committee.comments = "El formulario se guardó exitosamente."

        let committeRes = {
            dataValues: {
                id: 0
            }
        };
        if (committee.id != 0) {
            await committeesService.update(committee.id, committee, t);
            committeRes.dataValues.id = committee.id;
        } else {
            delete committee.id;
            committeRes = await committeesService.create(committee, t);
        }

        for (var supporter of supporters) {
            supporter['idCommittee'] = committeRes.dataValues.id;
            if (supporter.id != 0) {
                await supportersService.update(supporter.id, supporter, t);
            } else {
                delete supporter.id;
                await supportersService.create(supporter, t);
            }

            delete supporter.id;
            await supportersFinalService.create(supporter, t);
        }

        installationMinute['idCommittee'] = committeRes.dataValues.id;
        if (installationMinute.id != 0) {
            await installationMinutesService.update(installationMinute.id, installationMinute, t);
        } else {
            delete installationMinute.id;
            await installationMinutesService.create(installationMinute, t);
        }

        await updateRecords(idFile, username, t, committee, supporters)

        await t.commit();
        res.status(200).send({ success: true, data: committeRes.dataValues });

    } catch (error) {
        let rollback = await t.rollback();
        console.error(new Date().toString(), " ERROR: ", error)
        if (error.key) {
            res.status(500).send({ success: false, message: error.message });
        } else {
            res.status(500).send({ success: false, message: "Ha ocurrido un error en el servidor." });
        }
    }
}

const savePartial = async (req, res) => {
    const t = await sequelize.transaction();
    try {

        const {
            idFile,
            username,
            committee,
            supporters,
            installationMinute
        } = req.body;

        // const committeeExists = await committeesService.findOneByFolio(committee.folio);

        // if (committeeExists && committee.id == 0) {
        //     await t.rollback();
        //     console.error(new Date().toString(), "VALIDACIÓN: Ya existe un registro con el Folio: " + committee.folio)
        //     res.status(200).send({ success: false, message: "Ya existe un registro con el Folio: " + committee.folio, duplicate: true });
        //     return;
        // }

        //Mencionar que es guardado parcial
        committee.apiResponse = 200;
        committee.comments = "El formulario se guardó parcialmente."

        let committeRes = {
            dataValues: {
                id: 0
            }
        };
        if (committee.id != 0) {
            await committeesService.update(committee.id, committee, t);
            committeRes.dataValues.id = committee.id;
        } else {
            delete committee.id;
            committeRes = await committeesService.create(committee, t);
        }

        for (var supporter of supporters) {
            supporter['idCommittee'] = committeRes.dataValues.id;
            if (supporter.id != 0) {
                await supportersService.update(supporter.id, supporter, t);
            } else {
                delete supporter.id;
                await supportersService.create(supporter, t);
            }
        }

        installationMinute['idCommittee'] = committeRes.dataValues.id;
        if (installationMinute.id != 0) {
            await installationMinutesService.update(installationMinute.id, installationMinute, t);
        } else {
            delete installationMinute.id;
            await installationMinutesService.create(installationMinute, t);
        }

        await t.commit();
        res.status(200).send({ success: true, data: committeRes.dataValues.id });

    } catch (error) {
        let rollback = await t.rollback();
        console.error(new Date().toString(), " ERROR: ", error)
        res.status(500).send({ success: false, message: "Ha ocurrido un error en el servidor." });
    }
}

const deleteLogic = async (req, res) => {
    const { username, idPDFFile } = req.params;
    const t = await sequelize.transaction();

    try {

        let pdfFile = await pdfFilesService.findFileById(idPDFFile);

        //Actualizamos el registro con estado  en Guardado
        let pdfFileUpdate = pdfFile.dataValues;
        pdfFileUpdate.idStatus = STATUS_DELETE;
        pdfFileUpdate.saveDate = new Date();
        pdfFileUpdate.user = username;
        pdfFileUpdate.apiResponse = 200;
        pdfFileUpdate.comments = "Se elimina por duplicidad"
        await pdfFilesService.update(idPDFFile, pdfFileUpdate, t)

        const historyBody = {
            idPDFFile: idPDFFile,
            idStatus: STATUS_DELETE,
            createdDate: new Date(),
            user: username,
            apiResponse: 200
        };

        await historyService.create(historyBody, t);

        //eliminar el objecto del aws s3 
        await s3Client.send(new DeleteObjectCommand({
            Bucket: config.bucketname,
            Key: pdfFileUpdate.nameFile,
        }));

        await t.commit();
        res.status(200).send({ success: true, message: "El archivo duplicado ha sido eliminado." });

    } catch (error) {
        let rollback = await t.rollback();
        console.error(new Date().toString(), " ERROR: ", error)
        res.status(500).send({ success: false, message: "Ha ocurrido un error en el servidor." });
    }
}

const get = async (req, res) => {
    const { username, id } = req.body;
    console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,m", username, id)
    const t = await sequelize.transaction();

    try {

        let formBody = await getNextEditForm(id, username, t)

        if (!formBody) {
            await t.rollback();
            console.error(new Date().toString(), "VALIDACIÓN: No existen archivos por validar, intente mas tarde.")
            res.status(200).send({ success: false, message: "No existen archivos por validar, intente mas tarde." });
            return;
        }

        await t.commit();
        res.status(200).send({ success: true, ...formBody });

    } catch (error) {
        let rollback = await t.rollback();
        console.error(new Date().toString(), " ERROR: ", error)
        res.status(500).send({ success: false, message: "Ha ocurrido un error en el servidor." });
    }
}

module.exports = {
    save,
    savePartial,
    deleteLogic,
    get
};
