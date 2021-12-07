const router = require('express').Router();
const plantController = require('../Controller/plant.controller');
const logController = require('../Controller/log.controller');
const apiAuth = require('../Utils/Middleware/apiauth');

router.get('/getconfig', apiAuth, plantController.apigetplants);
router.post('/logplant', apiAuth, logController.apiLogPlant);

module.exports = router;
