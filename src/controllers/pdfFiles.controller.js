const PDFFilesService = require('../services/pdfFiles.service');
const HistoryService = require('../services/history.service');
const pdfFilesService = new PDFFilesService();
const historyService = new HistoryService();
const { sequelize } = require('../libs/sequelize');
const cos = require('../libs/cos');
const pdfParse = require('pdf-parse');
const { config } = require('../config/config');
const { STATUS_LOADED } = require('../enum/statusEnum');

const isTwoPagesPDF = async (file) => {
  const parsedPdf = await pdfParse(file.data);
  return parsedPdf.numpages == 2;
};

const saveFileToBucket = async (file, config) => {
  const putObjectPromise = cos.putObject({
    Bucket: config.bucketname,
    Key: file.name,
    Body: file.data
  }).promise();

  const data = await putObjectPromise;
  console.log(`Item: ${file.name} uploaded!`, data);
  return data;
};

const createRecords = async (file, cosItem, config, t) => {
  const fileBody = {
    urlFile: `${config.cosEnpoint}/${config.bucketname}/${file.name}`,
    nameFile: file.name,
    versionId: cosItem.VersionId,
    idStatus: STATUS_LOADED,
    uploadDate: new Date(),
    apiResponse: 200
  };

  const pdfFileCreated = await pdfFilesService.create(fileBody, t);

  const historyBody = {
    idPDFFile: pdfFileCreated.dataValues.id,
    idStatus: STATUS_LOADED,
    createdDate: new Date(),
    apiResponse: 200
  };

  await historyService.create(historyBody, t);
};

const save = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    console.error(new Date().toString(), " VALIDACIÓN: No se ha cargado ningún archivo.")
    return res.status(400).send('No se ha cargado ningún archivo.');
  }

  const file = req.files.file;


  const t = await sequelize.transaction();

  try {
    const isTwoPages = await isTwoPagesPDF(file);
    if (!isTwoPages) {
      console.log(`Se elimina el objecto: ${file.name} - No cumple con la condición de 2 hojas por archivo`)  
      await t.rollback();
      res.status(200).send('Deleted');
      return;
    }

    let dataObjectCos = await saveFileToBucket(file, config);

    await createRecords(file, dataObjectCos, config, t);

    await t.commit();

    res.status(200).send(`Success`);

  } catch (e) {
    console.error(new Date().toString(), " ERROR: ", e)
    await t.rollback();
    console.log(`Se elimina el objeto: ${file.name} del bucket`);
    await cos.deleteObject({
      Bucket: config.bucketname,
      Key: file.name
    }).promise();

    res.status(200).send('Failed');
  }
};

module.exports = {
  save
};