const crypt = require('../Utils/crypt');
const config = require('../Utils/settings').getSettings();
const user_model = require('../Model/users.model');
const mailer = require('../Utils/mail');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

var usersController = {
    getUser: getUser,
    deleteUser: deleteUser,
    activateMail: activateMail,
    changePassword: changePassword,
    changeEmail: changeEmail
}

//finding user from jwt token id and email
function getUser(req, res) {
    return new Promise((resolve, reject) => {
        user_model.findOne({where: {id : req.jwt_decode.id, email: req.jwt_decode.email}})
        .then((user) => {
            if(!user){
                if(req.originalUrl == '/front/user/getUser'){
                    res.status(404)
                    .json({
                        message: "User not found"
                    });
                }
                reject("User not found");
                return;
            }

            if(req.originalUrl != '/front/user/getUser'){
                resolve(user);
                return;
            }
            user.password = null;
            user.refresh_token_version = null;
            res.status(200)
            .json({
                message: "User found",
                user: user
            });
            return;
        })
        .catch((error) => {
            if(req.originalUrl == '/front/user/getUser'){
                res.status(404)
                .json({
                    message: "User not found",
                    error: error.toString()
                });
            }
            reject(error);
            return;
        });
    });
}

function deleteUser(_id) {
    user_model.destroy({where: {id: _id}})
    .then(() => {
        console.log("Deleted User with id: " + _id);
    })
    .catch((error) => {
        console.log(error);
    })
}

function activateMail(user_id){
    return user_model.update({email_confirmed : true}, {where: {id: user_id}})
}

function changePassword(password, user_id){
    return new Promise((resolve, reject) => {
        user_model.findByPk(user_id)
        .then((user) => {
            var new_refresh_token_version = user.dataValues.refresh_token_version + 1;

            crypt.cryptPassword(password, function(error, hash) {
                if(error) {
                    reject(error);
                    return;
                }
                
                resolve(user_model.update({password: hash, refresh_token_version: new_refresh_token_version}, {where: {id: user_id}}));
                return;
            })
        })
        .catch((error) => {
            reject(erorr);
            return;
        })
    })
}

// Changes E-Mail and Sends a new Verification E-Mail to the user
// Body: email
// Auth: Required
function changeEmail(req, res){

    //Look if email is already in use
    user_model.findOne({where: {email: req.body.email}})
    .then((double_mail_test) => {
        if(double_mail_test == null){

            //get user by the jwt id 
            user_model.findOne({where: {id : req.jwt_decode.id, email: req.jwt_decode.email}})
            .then((user) => {

                //update user with new email and set the email as unconfirmed
                //increment refresh_token_version so that the refresh token is no longer valid
                user_model.update(
                    {
                        email_confirmed: false, 
                        email: req.body.email, 
                        refresh_token_version: user.dataValues.refresh_token_version + 1
                    }, 
                    {
                        where : {
                            id : user.dataValues.id
                        }
                    })

                .then((new_user) => {
                    //get user with updated data
                    user_model.findOne({where: {id : req.jwt_decode.id}})
                    .then((updated_user) => {
                        console.log(updated_user)
                        //send verification Mail
                        mailer.sendKeyMail(updated_user, 'mail_verification')
                        .then((mail_report) => {
                            res.status(201).json({
                                message: "Email Updated",
                                email_report: mail_report
                            });
                            return;
                        })
                        .catch((error) => {
                            console.log(error)
                            res.status(500)
                            .json({
                                message: "User updated but sending mail verification failed",
                                error: error.toString()
                            });
                            return
                        });  
                    })
                    .catch((error) => {
                        res.status(500)
                        .json({
                            message: "Error getting updated user",
                            error: error.toString()
                        });
                        return;
                    });
                })
                .catch((error) => {
                    console.log(error)
                    res.status(500)
                    .json({
                        message: "Error updating user",
                        error: error.toString()
                    });
                    return;
                });
                
            })
            .catch((error) => {
                res.status(500)
                .json({
                    message: "Error getting user",
                    error: error.toString()
                });
                return;
            });
        }
        else{
            res.status(500)
            .json({
                message: "Email is already in use"
            });
            return;
        }
    })
}

module.exports = usersController;