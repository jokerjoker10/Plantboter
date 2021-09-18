const crypt = require('../Utils/crypt');
const config = require('../Utils/settings').getSettings();
const user_model = require('../Model/users.model');
const mailer = require('../Utils/mail');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

var usersController = {
    addUser: addUser,
    getUser: getUser,
    loginUser: loginUser,
    deleteUser: deleteUser,
    getUserByMail: getUserByMail,
    activateMail: activateMail,
    changePassword: changePassword,
    changeEmail: changeEmail
}

// adds a new user to the database
function addUser(req, res) {
    // check settings
    if (!config.auth.allow_regrestration) {
        res.status(403)
        .json({
            message: "Regestration deactivated"
        })
        return;
    }

    //check if password and second_password are the same
    if (req.body.password != req.body.second_password){
        res.status(400)
        .json({
            message: "password and second_password required to be the same"
        });
        return;
    }

    // check if user with email already exists
    user_model.findAll({where: {email : req.body.email}})
    .then((data) => {
        if(data.length != 0){
            res.status(400).json({
                message: "user already exist"
            })
            return;
        }

        // crypt password
        crypt.cryptPassword(req.body.password, function(error, hash) {
            if(error) {
                res.status(500).json({
                    message: "Hashing Password Failed"
                })
                return;
            }
            
            //save user to database
            user_model.create({
                email: req.body.email,
                password: hash
            })
            .then((data) => {
                mailer.sendKeyMail(data, 'mail_verification')
                .then((mail_report) => {
                    data.password = null;
                    res.status(201).json({
                        message: "User created",
                        user: data,
                        email_report: mail_report
                    });
                    return;
                })
                .catch((error) => {
                    res.status(500)
                    .json({
                        message: "User created but sending mail verification failed",
                        error: error
                    });
                });            
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Saving to Database failed",
                    error: error
                });
                return;
            });
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            message: "database error"
        });
    });    
}

//finding user from jwt token id and email
function getUser(req, res) {
    return new Promise((resolve, reject) => {
        user_model.findOne({where: {id : req.jwt_decode.id, email: req.jwt_decode.email}})
        .then((user) => {
            user.password = null;
            if(req.originalUrl == '/front/user/getUser'){
                res.status(200)
                .json({
                    message: "User found",
                    user: user
                });
            }
            resolve(user);
            return;
        })
        .catch((error) => {
            if(req.originalUrl == '/front/user/getUser'){
                res.status(404)
                .json({
                    message: "User not found",
                    error: error
                });
            }
            reject(error);
            return;
        });
    });
}

//Login User by looking up mail in db and comparing passwords
function loginUser(req, res) {

    //validate user input
    if(!(req.body.email && req.body.password)){
        res.status(400)
        .json({
            message: "Input missing"
        });
        return;
    }

    //find user by mail and start login procedure
    user_model.findOne({where: {email: req.body.email}})
    .then((data) => {

        //forbid user login if email is not confirmed
        if(!data.dataValues.email_confirmed){
            res.status(403)
            .json({
                message: "Email not confirmed. Login forbidden!"
            });
            return;
        }

        //comparing passwords
        bcrypt.compare(req.body.password, data.dataValues.password)
        .then((result) => {
            if(result){
                //user login successfull
                //sign json web token
                let token = jwt.sign({
                    id: data.dataValues.id,
                    email: data.dataValues.email,
                    email_confirmed: data.dataValues.email_confirmed,
                    admin: data.dataValues.admin,
                    created_at: data.dataValues.created_at,
                    updated_at: data.dataValues.updated_at
                },
                config.auth.token_key,
                {
                  expiresIn: "2h",
                });
                
                data.dataValues.token = token;

                res
                .setHeader("x-access-token", token)
                .status(200)
                .json({
                    message: "User logged in",
                    user: data.dataValues
                });
                return;
            }
            else {
                res.status(401)
                .json({
                    message: "Email or Password wrong"
                });
                return;
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(401)
            .json({
                message: "User authentification failed"
            });
            return;
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(401)
        .json({
            message: "Email or Password Wrong"
        });
        return;
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

function getUserByMail(email){
    return user_model.findOne({where: {email: email}});
}

function activateMail(user_id){
    return user_model.update({email_confirmed : true}, {where: {id: user_id}})
}

function changePassword(password, user_id){
    return new Promise((resolve, reject) => {
        crypt.cryptPassword(password, function(error, hash) {
            if(error) {
                reject(error);
                return;
            }
            
            resolve(user_model.update({password: hash}, {where: {id: user_id}}));
            return;
        })
    })
}

function changeEmail(req, res){
    getUserByMail(req.body.email)
    .then((double_mail_test) => {
        if(double_mail_test == null){
            getUser(req, res)
            .then((user) => {
                user_model.update({email_confirmed: false, email: req.body.email}, {where : {id : user.dataValues.id}})
                .then(() => {
                    mailer.sendKeyMail(user, 'mail_verification')
                    .then((mail_report) => {
                        res.status(201).json({
                            message: "Email Updated",
                            email_report: mail_report
                        });
                        return;
                    })
                    .catch((error) => {
                        res.status(500)
                        .json({
                            message: "User updated but sending mail verification failed",
                            error: error
                        });
                        return
                    });  
                })
                .catch((error) => {
                    console.log(error)
                    res.status(500)
                    .json({
                        message: "Error updating user",
                        error: error
                    });
                    return;
                })
                
            })
            .catch((error) => {
                res.status(500)
                .json({
                    message: "Error getting user",
                    error: error
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