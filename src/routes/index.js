const express = require('express'); 

const formRouter = require('./form.router');
const usersRouter = require('./users.router');
const pdfFilesRouter = require('./pdfFiles.router');
const processedPDFRouter = require('./processedPDF.router');
const usersCallCenterRouter = require('./usersCallcenter.router');
const callCenterRouter = require('./callcenter.router');
const reportsRouter = require('./reports.router');
const supportersRouter = require('./supporters.router');
const callsRouter = require('./calls.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router); 
  router.use('/auth', usersRouter);
  router.use('/form', formRouter);
  router.use('/files', pdfFilesRouter);
  router.use('/process', processedPDFRouter);
  router.use('/auth/callcenter', usersCallCenterRouter);
  router.use('/callcenter', callCenterRouter);
  router.use('/reports', reportsRouter);
  router.use('/supporters', supportersRouter);
  router.use('/calls', callsRouter);
}

module.exports = routerApi;