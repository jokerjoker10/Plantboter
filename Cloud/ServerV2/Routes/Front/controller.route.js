const router = require('express').Router();
const authController = require('../../Controller/auth.controller');
const controllerController = require('../../Controller/controller.controller');

router.get('/', controllerController.getController);
router.post('/info', controllerController.getControllerInfo);
router.post('/create', controllerController.createController);
router.post('/:id', controllerController.updateController);

module.exports = router;