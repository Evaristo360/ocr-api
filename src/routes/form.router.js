const express = require('express');
const router = express.Router(); 
const formController = require('../controllers/form.controller');

const auth = require('../middlewares/auth');

router
    .post('/register',auth, formController.save )
    .post('/partial', auth, formController.savePartial)
    .post('/get', auth, formController.get)
    .delete('/user/:username/delete/:idPDFFile', auth, formController.deleteLogic)

module.exports = router;