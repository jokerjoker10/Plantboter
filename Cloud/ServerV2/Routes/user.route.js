const router = require('express').Router();
const userController = require('../Controller/users.controller');
const auth = require('../Utils/Middleware/auth');

router.post('/', userController.addUser);
router.post('/login', userController.loginUser)
router.get('/getUser',auth, userController.getUser)

module.exports = router;