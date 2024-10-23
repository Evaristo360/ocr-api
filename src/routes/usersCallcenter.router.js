const express = require('express');
const router = express.Router();
const usersCallCenterController = require('../controllers/usersCallcenter.controller');

router
    .post('/register', usersCallCenterController.register)
    .post('/login', usersCallCenterController.login)

module.exports = router;