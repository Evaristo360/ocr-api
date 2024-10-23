const ProcessedPDFService = require('../services/processedPDF.service');
const HistoryService = require('../services/history.service');
const PDFFilesService = require('../services/pdfFiles.service');
const { sequelize } = require('../libs/sequelize');
const { STATUS_PROCESSED, STATUS_EDITING } = require('../enum/statusEnum');
const { config } = require('../config/config');
const cos = require('../libs/cos');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { TextractClient, StartDocumentAnalysisCommand, GetDocumentAnalysisCommand } = require('@aws-sdk/client-textract');

const paramsClient = {
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretAccess,
  }
}

const s3Client = new S3Client(paramsClient);
const textractClient = new TextractClient(paramsClient);
const processedPDFService = new ProcessedPDFService();
const historyService = new HistoryService();
const pdfFilesService = new PDFFilesService();


const getConfigStartDocumentAnalysisCommand = (filename) => {
  return {
    DocumentLocation: {
      S3Object: {
        Bucket: config.bucketname,
        Name: filename,
      },
    },
    FeatureTypes: ["FORMS"]
  }
}

const proccessFile = async (fileName) => {
  try {
    const file = await cos.getObject({
      Bucket: config.bucketname,
      Key: fileName,
    }).promise();

    const params = {
      Bucket: config.bucketname,
      Key: fileName,
      Body: file.Body,
    };

    await s3Client.send(new PutObjectCommand(params));

    const paramsCommand = getConfigStartDocumentAnalysisCommand(fileName);
    const analyzeCommand = new StartDocumentAnalysisCommand(paramsCommand);
    const { JobId } = await textractClient.send(analyzeCommand);

    return JobId;
  } catch (error) {
    console.error('Error in proccessFile:', error);
    throw error;
  }
}

const load = async (req, res) => {
  const { username } = req.params;
  const t = await sequelize.transaction();

  try {
    const pdfFile = await pdfFilesService.findFileToProcess();

    if (!pdfFile) {
      await t.rollback();
      console.error(new Date().toString(), " VALIDACIÓN: No existen archivos por procesar, intente mas tarde.");
      res.status(200).send({ success: false, message: "No existen archivos por procesar, intente mas tarde." });
      return;
    }

    const idPdfFile = pdfFile.dataValues.id;
    const pdfFilename = pdfFile.dataValues.nameFile;

    let jobId;

    try {
      jobId = await proccessFile(pdfFilename);
    } catch (error) {
      console.error(new Date().toString(), " ERROR: ", error)
      await t.rollback();
      await s3Client.send(new DeleteObjectCommand({
        Bucket: config.bucketname,
        Key: fileName,
      }));
      res.status(500).send({ success: false, message: 'Error procesando el archivo, intentelo de nuevo.' });
      return;
    }


    const processedBody = {
      idPDFFile: idPdfFile,
      dataS3: jobId,
      createdDate: new Date(),
      user: username,
      apiResponse: 200
    };

    await processedPDFService.create(processedBody, t);

    const historyBody = {
      idPDFFile: idPdfFile,
      idStatus: STATUS_PROCESSED,
      createdDate: new Date(),
      user: username,
      apiResponse: 200
    };

    await historyService.create(historyBody, t);

    let pdfFileUpdate = pdfFile.dataValues;
    pdfFileUpdate.idStatus = STATUS_EDITING;
    pdfFileUpdate.user = username;
    pdfFileUpdate.processDate = new Date();
    pdfFileUpdate.editDate = new Date();

    await pdfFilesService.update(idPdfFile, pdfFileUpdate, t)


    const historyBodyCreate = {
      idPDFFile: idPdfFile,
      idStatus: STATUS_EDITING,
      createdDate: new Date(),
      user: username,
      apiResponse: 200
    };

    await historyService.create(historyBodyCreate, t);

    await t.commit()
    res.status(200).send({ success: true, id: idPdfFile });
  } catch (error) {
    await t.rollback();
    console.error('Error in load');
    console.error(new Date().toString(), " ERROR: ", error)
    res.status(500).send({ success: false, message: 'Internal server error, please try again.' });
  }
}

module.exports = {
  load
};