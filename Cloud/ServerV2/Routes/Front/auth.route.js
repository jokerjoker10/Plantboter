const router = require('express').Router();
const authController = require('../../Controller/auth.controller');
const auth = require('../../Utils/Middleware/auth');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.delete('/logout', auth, authController.logout);
router.post('/refreshToken', authController.refreshToken);

module.exports = router;