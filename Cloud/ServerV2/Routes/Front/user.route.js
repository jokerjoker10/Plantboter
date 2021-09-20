const router = require('express').Router();
const userController = require('../../Controller/users.controller');
const auth = require('../../Utils/Middleware/auth');

router.get('/getUser',auth, userController.getUser);
router.post('/changeemail',auth, userController.changeEmail);

module.exports = router;