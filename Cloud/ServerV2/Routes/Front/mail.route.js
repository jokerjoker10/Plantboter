const router = require('express').Router();
const mailController = require('../../Controller/mail.controller');

router.get('/requestmailverification', mailController.sendMailVerification);
router.post('/verifymail', mailController.verifyEmail)

module.exports = router;