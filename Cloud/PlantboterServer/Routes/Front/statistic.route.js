const router = require('express').Router();
const statisticController = require('../../Controller/statistic.controller');

router.get('/getPlantDashboard', statisticController.getPlantDashboard);

module.exports = router;