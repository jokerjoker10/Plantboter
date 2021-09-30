const crypt = require('../Utils/crypt');
const config = require('../Utils/settings').getSettings();
const user_model = require('../Model/users.model');
const user_controller = require('../Controller/users.controller');
const mailer = require('../Utils/mail');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

var authController = {
    login: login,
    signup: signup,
    logout: logout,
    refreshToken: refreshToken
}

function login(req, res){
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
        
        //check if user exists
        if(!data){
            res.status(400)
            .json({
                message: "Email or Password wrong"
            });
            return;
        }

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
                let access_token = jwt.sign({
                    id: data.dataValues.id,
                    email: data.dataValues.email,
                    email_confirmed: data.dataValues.email_confirmed,
                    admin: data.dataValues.admin,
                    created_at: data.dataValues.created_at,
                    updated_at: data.dataValues.updated_at
                },
                config.auth.access_token_key,
                {
                  expiresIn: "15m",
                });
                
                let refresh_token = jwt.sign({
                    id: data.dataValues.id,
                    refresh_token_version: data.dataValues.refresh_token_version
                },
                config.auth.refresh_token_key,
                {
                  expiresIn: "30d",
                });

                data.dataValues.password = null;
                data.dataValues.refresh_token_version = null;
                
                res
                .status(200)
                .json({
                    message: "User logged in",
                    user: data.dataValues,
                    access_token: access_token,
                    refresh_token: refresh_token
                })
                .setHeader("x-access-token", access_token);
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

function signup(req, res){
    //verify input
    //encrypt password
    //create user
    //send mail with verification code


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
                    data.refresh_token_version = null;
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

function logout(req, res){
    //get user
    //increment refresh token version
    user_controller.getUser(req, res)
    .then((user) => {
        user_model.update({refresh_token_version: user.dataValues.refresh_token_version + 1}, {where: {id: user.dataValues.id}})
        .then(() => {
            res.status(200)
            .json({
                message: "User logged out"
            });
            return;
        })
        .catch((error) => {
            res.status(500)
            .json({
                message: "Logging out failed"
            });
            return;
        });
    })
    .catch((error) => {
        res.status(500)
        .json({
            message: "Getting user failed"
        });
        return;
    })
}

function refreshToken(req, res){
    //decode refresh token
    //compare versions
    //generate new access token

    var refresh_token = req.body.refresh_token;
    //check if token is set in cookies
    if(refresh_token == undefined){
        res.status(401)
        .json({
            message: "No refresh token provided"
        });
        return;
    }

    //decode the token using token secret
    try {
        decoded_refresh_token = jwt.verify(refresh_token, config.auth.refresh_token_key)
    }
    catch (error){
        res.status(401)
        .json({
            message: "Invalid Refresh Token"
        });
        return;
    }

    user_model.findOne({where: {id: decoded_refresh_token.id}})
    .then((user) => {
        if(user.dataValues.refresh_token_version == decoded_refresh_token.refresh_token_version){
            //refresh token valid
            let access_token = jwt.sign({
                id: user.dataValues.id,
                email: user.dataValues.email,
                email_confirmed: user.dataValues.email_confirmed,
                admin: user.dataValues.admin,
                created_at: user.dataValues.created_at,
                updated_at: user.dataValues.updated_at
            },
            config.auth.access_token_key,
            {
                expiresIn: "15m",
            });

            user.dataValues.token = access_token;
            user.dataValues.password = null;
            user.dataValues.refresh_token_version = null;

            res
            .status(200)
            .json({
                message: "Token Refreshed",
                access_token: access_token
            });
            return;
        }

        //refresh token not equal to database
        res.status(401)
        .json({
            message: "User not Authentificated"
        });
    })
    .catch((error) => {
        console.log(error)
        res.status(500)
        .json({
            message: "Getting user data failed"
        });
        return;
    });
}

module.exports = authController;