const router = require('express').Router();
const mailController = require('../../Controller/mail.controller');

router.get('/requestmailverification', mailController.sendMailVerification);
router.get('/requestpasswordreset', mailController.sendPasswordResetMail);
router.post('/verifymail', mailController.verifyEmail);
router.post('/resetpassword', mailController.resetPassword);

module.exports = router;