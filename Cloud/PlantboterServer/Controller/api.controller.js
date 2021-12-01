const settings = require('../Utils/settings').getFrontendSettings();
const api_model = require('../Model/apikeys.model');
const controller_model = require('../Model/controllers.model');
const user_controller = require('../Controller/users.controller');
const crypt = require('../Utils/crypt');

const apiController = {
    createApiKey: createApiKey,
    getApiKey: getApiKey,
}

function createApiKey(req, res) {
    var date = new Date(req.body.expires_at).toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '');  
    const data = {
        expires_at: req.body.expires_at == null ? null : new Date(req.body.expires_at),
        controller_id: req.body.controller_id
    }
    
    console.log(data.expires_at)
    if (!data.controller_id) {
        res.status(400)
            .json({
                message: 'Error: controller_id required'
            });
        return;
    }

    user_controller.getUser(req, res)
        .then((user) => {
            controller_model.findOne({ where: { id: data.controller_id } })
                .then((controller) => {

                    // look if user belongs to the controller
                    if (controller.dataValues.userId != user.id) {
                        res.status(403)
                            .json({
                                message: 'Unauthorized to access ressource'
                            });
                        return;
                    }

                    api_model.findAll({})
                        .then((api_list) => {
                            var current_key = '';
                            // generate new API Keys until it is unique
                            if(api_list.length <= 0){
                                current_key = crypt.generateApiKey();
                            }
                            else{
                                var key_list = [];
                                
                                api_list.forEach(element => {
                                    key_list.push(element.dataValues.key)
                                });

                                while (true) {
                                    // generate key
                                    current_key = crypt.generateApiKey();
                                    // look if key is in list
                                    if (current_key in key_list) { }
                                    else {
                                        break;
                                    }
                                }
                            }
                            
                            //deactivate every active api key
                            api_model.update({status: "inactive"},{where: {status: "active", controllerId: controller.dataValues.id}})
                            .then(() => {
                                console.log(data.expires_at.getFullYear() + "-" + data.expires_at.getMonth() + "-" + data.expires_at.getDay())
                                api_model.create({
                                    key: current_key,
                                    expires_at: data.expires_at.getUTCDate(),
                                    controllerId: controller.dataValues.id,
                                })
                                .then((api_key) => {
                                    res.status(201)
                                        .json({
                                            message: 'API Key Generated',
                                            api_key: current_key,
                                            expires_at: data.expires_at,
                                        });
                                    return;
                                })
                                .catch((error) => {
                                    res.status(500)
                                        .json({
                                            message: 'Error creating API Key',
                                            error: error.toString()
                                        });
                                    return;
                                });
                            })
                            .catch((error) => {
                                res.status(500)
                                .json({
                                    message: 'Deactivating Old Api Keys Failed',
                                    error: error.toString()
                                });
                            return;
                            });
                        })
                        .catch((error) => {
                            res.status(500)
                                .json({
                                    message: 'API Key List Error',
                                    error: error.toString()
                                });
                            return;
                        });
                })
                .catch((error) => {
                    res.status(500)
                        .json({
                            message: 'Finding Controller failed',
                            error: error.toString()
                        });
                    return;
                });
        })
        .catch((error) => {
            res.status(500)
                .json({
                    message: 'User not found',
                    error: error.toString()
                });
            return;
        });
}

function getApiKey(req, res){
    var data = {
        controller_id: req.params.controller_id
    }

    if(!data.controller_id){
        res.status(400)
            .json({
                message: 'Error: controller_id required'
            });
        return;
    }

    user_controller.getUser(req, res)
    .then((user) => {
        controller_model.findOne({ where: { id: data.controller_id } })
        .then((controller) => {
            // look if user belongs to the controller
            if (controller.dataValues.userId != user.id) {
                res.status(403)
                    .json({
                        message: 'Unauthorized to access ressource'
                    });
                return;
            }
            
            api_model.findAll({where: {controller_id: data.controller_id}})
            .then((api_key) => {
                res.status(200)
                .json({
                    message: 'API Key Found',
                    api_key: api_key
                });
                return;
            })
            .catch((error) => {
                res.status(500)
                .json({
                    message: 'API Key List Error',
                    error: error.toString()
                });
                return;
            });
        })
        .catch((error) => {
            res.status(500)
            .json({
                message: 'Finding Controller failed',
                error: error.toString()
            });
            return;
        });
    })
    .catch((error) => {
        res.status(500)
            .json({
                message: 'User not found',
                error: error.toString()
            });
        return;
    });
}

module.exports = apiController;