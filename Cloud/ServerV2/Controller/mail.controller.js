const mailer = require("../Utils/mail");
const mail_model = require("../Model/mail.model");
const user_controller = require("../Controller/users.controller");

var mailController = {
    verifyEmail: verifyEmail,
    sendMailVerification: sendMailVerification
}

function verifyEmail(req, res){

}

function sendMailVerification(req, res){
    user_controller.getUserByMail(req.body.email)
    .then((user) => {
        mailer.sendVerificationMail(user)
        .then((data) => {
            res.status(200)
            .json(data);
            return;
        })
        .catch((error) => {
            res.status(500)
            .json({
                message: "Error sending verification mail",
                error: error
            });
            return;
        });
    });
}


module.exports = mailController;