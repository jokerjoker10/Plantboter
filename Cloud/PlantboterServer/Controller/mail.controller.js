const mailer = require("../Utils/mail");
const mail_model = require("../Model/mail.model");
const user_model = require("../Model/users.model");
const user_controller = require("../Controller/users.controller");
const jwt = require("jsonwebtoken");
const e = require("express");
const config = require("../Utils/settings").getSettings();

var mailController = {
    verifyEmail: verifyEmail,
    resetPassword: resetPassword,
    sendMailVerification: sendMailVerification,
    sendPasswordResetMail: sendPasswordResetMail
}

function verifyEmail(req, res){
    if(!req.body.key || !req.body.email){
        res.status(400)
        .json({
            message: "Key and email are required"
        }); 
        return;
    }

    user_model.findOne({where: {email: req.body.email}})
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
                    message: "Key inactive"
                });
                return;
            }

            //activating user
            user_model.update({email_confirmed: true}, {where: {id: user.id}})
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

function resetPassword(req, res){
    var jwt_decode = null;
    var email = "";

    if((null || undefined) != req.headers["x-access-token"]){
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


    if(!req.body.key || !req.body.password || !req.body.second_password){
        res.status(400)
        .json({
            message: "Key, password and second_password are required"
        }); 
        return;
    }

    if(req.body.password != req.body.second_password){
        res.status(400)
        .json({
            message: "password and second_password must be the same"
        });
        return;
    }

    user_model.findOne({where: {email: email}})
    .then((user) => {
        mail_model.findOne({where: {key: req.body.key}})
        .then((mail_code) => {
            //check if code belongs to mail and if mail_code is found and if mail_type is mail_verification
            if(mail_code == null || mail_code.dataValues.userId != user.dataValues.id || mail_code.dataValues.mail_type != 'password_reset'){
                res.status(400)
                .json({
                    message: "Code unknown"
                });
                return;
            }

            if(!mail_code.dataValues.active){
                res.status(400)
                .json({
                    message: "Key inactive"
                });
                return;
            }

            //reset password
            user_controller.changePassword(req.body.password, user.dataValues.id)
            .then((response) => {
                res.status(200)
                .json({
                    message: "Password successfull updated"
                });
                return;
            })
            .catch((error) => {
                res.status(500)
                .json({
                    message: "Saving new Password failed",
                    error: error
                });
                return;
            });
        })
        .catch((error) => {
            console.log(error)
            res.status(500)
            .json({
                message: "Finding Code Failed",
                error: error
            });
            return;
        });
    })
    .catch((error) =>  {
        res.status(400)
        .json({
            message: "User not found",
            error: error
        })
    });
}

function sendMailVerification(req, res){
    user_model.findOne({where: {email: req.body.email}})
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

    if(req.headers["x-access-token"] != null){
        try{
            jwt_decode = jwt.verify(req.headers["x-access-token"], config.auth.access_token_key);
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
    user_model.findOne({where: {email: email}})
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