const router = require('express').Router();
const userController = require('../Controller/users.controller');

router.post('/', userController.addUser);
router.post('/login', userController.loginUser)

module.exports = router;