const express = require('express');
const router = express.Router();
const callCenterController = require('../controllers/callcenter.controller');

router
    .post('/register', callCenterController.save)
    .get('/next/:idUser', callCenterController.getNext)

module.exports = router;