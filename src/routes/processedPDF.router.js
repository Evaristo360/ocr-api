const express = require('express');
const router = express.Router();
const processedPDFController = require('../controllers/processedPDF.controller');

const auth = require('../middlewares/auth');

router
  .get('/load/:username', auth, processedPDFController.load);

module.exports = router;