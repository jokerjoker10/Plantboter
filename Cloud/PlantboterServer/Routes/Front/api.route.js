const router = require('express').Router();
const apiController = require('../../Controller/api.controller');

router.post('/', apiController.createApiKey);
router.get('/:controller_id', apiController.getApiKey);

module.exports = router;