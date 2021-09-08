const crypt = require('../Utils/crypt');
const config = require('../Utils/settings').getSettings();
const user_model = require('../Model/users.model');
const mailer = require('../Utils/mail');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

var usersController = {
    addUser: addUser,
    getUserById: getUserById,
    authenticateUser: authenticateUser,
    loginUser: loginUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getUserByMail: getUserByMail
}

// adds a new user to the database
function addUser(req, res) {
    // check settings
    if (!config.auth.allow_regrestration) {
        res.status(403).json({
            message: "Regestration deactivated"
        })
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
        crypt.cryptPassword(req.body.password, function(err, hash) {
            if(err) {
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
                mailer.sendVerificationMail(data)
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
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    message: "Saving to Database failed"
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

function getUserById(req, res) {
    user_model.findAll({where: {id: req.body.id}})
    .then((data) => {
        data.password = null,
        data.session = null
        res.status(200).json({
            message: "User found",
            user: data
        })
    })
    .catch((err) => {
        res.status(404).json({
            message: "No sutch user"
        })
    });
}

function authenticateUser(_session) {
    user_model.findAll({where: {session: _session}})
    .then((data) => {
        data.password = null,
        data.session = null
        return (true, data);
    })
    .catch((err) => {
        return (false, {})
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

                res.status(200)
                .json({
                    message: "User logged in",
                    user: data.dataValues
                });

            }
            else {
                res.status(401)
                .json({
                    message: "Email or Password wrong"
                });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(401)
            .json({
                message: "User authentification failed"
            });
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(401)
        .json({
            message: "Email or Password Wrong"
        });
    });
}

function updateUser(user, _id) {
    user_model.update({email: user.email}, {where: {id: _id}})
    .then((data) => {
        data.password = null;
        data.session = null;
        return data;
    })
    .catch((error) => {
        console.log(error);
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

module.exports = usersController;