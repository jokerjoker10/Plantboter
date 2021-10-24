const router = require('express').Router();
const plantController = require('../../Controller/plant.controller');

router.get('/plantsofcontroller/:id', plantController.getPlantsFromController);
router.post('/', plantController.createPlant);
router.get('/:id', plantController.getPlantInfo);

module.exports = router;