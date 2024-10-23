const express = require('express');
const router = express.Router();
const callController = require('../controllers/calls.controller.js');

router
  .get('/make', callController.call)
  .post('/answer', callController.answer)
  .get('/audio', callController.getAudio)
  .post('/status', callController.updateCallStatus)

module.exports = router;