const router = require('express').Router();

const settingsController = require('../../Controller/settings.controller')

router.get('/', settingsController.getSettings);

module.exports = router;