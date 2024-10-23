const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');

router
    .get('/general/:email', reportsController.downloadGeneral);

module.exports = router;