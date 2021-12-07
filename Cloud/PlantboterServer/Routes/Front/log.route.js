const router = require('express').Router();
const mailController = require('../../Controller/mail.controller');

router.post('/requestmailverification', mailController.sendMailVerification);
router.post('/requestpasswordreset', mailController.sendPasswordResetMail);
router.post('/verifymail', mailController.verifyEmail);
router.post('/resetpassword', mailController.resetPassword);

module.exports = router;