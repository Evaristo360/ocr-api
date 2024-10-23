const express = require('express');
const router = express.Router();
const supportersController = require('../controllers/supporters.controller');

router
    .post('/load', supportersController.LoadSupporters);

module.exports = router;