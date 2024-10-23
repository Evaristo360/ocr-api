const express = require('express');
const router = express.Router();
const pdfFilesController = require('../controllers/pdfFiles.controller');

router
  .post('/upload', pdfFilesController.save)

module.exports = router;