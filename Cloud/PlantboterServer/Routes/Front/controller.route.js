const router = require('express').Router();
const controllerController = require('../../Controller/controller.controller');

router.get('/', controllerController.getControllerList);
router.get('/info/:id', controllerController.getControllerInfo);
router.post('/create', controllerController.createController);
router.post('/:id', controllerController.updateController);

module.exports = router;