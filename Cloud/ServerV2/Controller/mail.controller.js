const mailer = require("../Utils/mail");
const mail_model = require("../Model/mail.model");
const user_controller = require("../Controller/users.controller");
const jwt = require("jsonwebtoken");
const e = require("express");
const config = require("../Utils/settings").getSettings();

var mailController = {
    verifyEmail: verifyEmail,
    sendMailVerification: sendMailVerification,
    sendPasswordResetMail: sendPasswordResetMail
}

function verifyEmail(req, res){
    if(!req.body.key || !req.body.email){
        res.status(400)
        .json({
            message: "Key and email are required"
        }); 
    }

    user_controller.getUserByMail(req.body.email)
    .then((user) => {
        if(user.dataValues.email_confirmed){
            res.status(400)
            .json({
                message: "Email already confirmed"
            });
            return;
        }

        mail_model.findOne({where: {key: req.body.key}})
        .then((mail_code) => {
            //check if code belongs to mail and if mail_code is found and if mail_type is mail_verification
            if(mail_code == null || mail_code.dataValues.userId != user.dataValues.id || mail_code.dataValues.mail_type != 'mail_verification'){
                res.status(400)
                .json({
                    message: "Code unknown"
                });
                return;
            }

            if(!mail_code.dataValues.active){
                res.status(400)
                .json({
                    message: "Code inactive"
                });
                return;
            }

            //activating user
            user_controller.activateMail(user.id)
            .then((updated_user) => {
                //deactivating code
                mail_model.update({active: false},{where: {id: mail_code.dataValues.id}})
                .then((updated_mail_code) => {
                    res.status(200)
                    .json({
                        message: "Account Activated"
                    });
                    return;
                })
                .catch((error) => {
                    res.status(500)
                    .json({
                        message: "Deactivating code failed"
                    });
                    return;
                });
            })
            .catch((error) => {
                res.status(500)
                .json({
                    message: "Activating mail failed",
                    error: error
                });
                return;
            });            
        })
        .catch((error) => {
            res.status(500)
            .json({
                message: "Finding Code Failed",
                error: error
            });
            return;
        });
    });
}

function sendMailVerification(req, res){
    user_controller.getUserByMail(req.body.email)
    .then((user) => {
        mailer.sendKeyMail(user, 'mail_verification')
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

function sendPasswordResetMail(req, res){
    var jwt_decode = null;
    var email = "";

    if(token = req.headers["x-access-token"]){
        try{
            jwt_decode = jwt.verify(req.headers["x-access-token"], config.auth.token_key);
        }
        catch (err) {}
    }

    if(jwt_decode != null){
        email = jwt_decode.email;
    }
    else if(Object.keys(req.body).includes('email')){
        email = req.body.email
    }
    else{
        res.status(400)
        .json({
            message: "Email or access token required"
        });
        return;
    }

    //Input ok. Begin Sending Mail
    user_controller.getUserByMail(email)
    .then((user) => {
        mailer.sendKeyMail(user, 'password_reset')
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