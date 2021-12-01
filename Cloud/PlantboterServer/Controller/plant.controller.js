const settings = require('../Utils/settings').getFrontendSettings();
const plant_model = require('../Model/plants.model');
const controller_model = require('../Model/controllers.model');
const user_controller = require('../Controller/users.controller');

// page index and definition for export
const plantController = {
    getPlantInfo: getPlantInfo,
    createPlant: createPlant,
    getPlantsFromController: getPlantsFromController,
    updatePlant: updatePlant,
}

function getPlantInfo(req, res) {
    var plant_id = req.params.id;

    if (!plant_id) {
        res.status(400)
            .json({
                message: 'Error: plant id required'
            });
        return;
    }

    user_controller.getUser(req, res)
        .then((user) => {
            plant_model.findOne({ where: { id: plant_id } })
                .then((plant) => {
                    controller_model.findOne({ where: { id: plant.dataValues.controllerId } })
                        .then((controller) => {
                            // check if authorized to access
                            if (controller.dataValues.userId != user.dataValues.id) {
                                console.log("Unauthorized to access ressource")
                                res.status(403)
                                    .json({
                                        message: 'Unauthorized to access ressource'
                                    });
                                return;
                            }
                            else{
                                res.status(200)
                                    .json({
                                        message: 'Plant found',
                                        plant: plant
                                    });
                                return;
                            }
                        })
                        .catch((error) => {
                            res.status(500)
                                .json({
                                    message: 'Error finding controller',
                                    error: error.toString()
                                });
                            return;
                        });
                })
                .catch((error) => {
                    res.status(500)
                        .json({
                            message: 'Error finding Plant',
                            error: error.toString()
                        });
                    return;
                })
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

function createPlant(req, res) {
    var defaults = settings.settings.plants;
    var data = {
        controllerId: req.body.controller_id,
        name: req.body.name,
        sensor_pin: req.body.sensor_pin,
        pump_pin: req.body.pump_pin,
        trigger_percentage: req.body.trigger_percentage,
        sensor_type: req.body.sensor_type,
        pump_time: req.body.pump_time
    }

    if (!data.controllerId) {
        res.status(400)
            .json({
                message: 'Error: controller_id required'
            });
        return;
    }
    if (!data.name) {
        data.name = defaults.default_name;
    }
    if (!data.sensor_pin) {
        data.sensor_pin = defaults.default_sensor_pin
    }
    if (!data.pump_pin) {
        data.pump_pin = defaults.default_pump_pin
    }
    if (!data.trigger_percentage || data.trigger_percentage < defaults.trigger_percentage.min || data.trigger_percentage > defaults.trigger_percentage.min) {
        data.trigger_percentage = defaults.trigger_percentage.default;
    }
    if (!data.pump_time || data.pump_time < defaults.pump_time.min || data.pump_time > defaults.pump_time.min) {
        data.pump_time = defaults.pump_time.default;
    }
    if (!data.sensor_type || data.sensor_type != ("digital" || "analog")) {
        data.sensor_type = defaults.default_sensor_type;
    }

    user_controller.getUser(req, res)
        .then((user) => {
            controller_model.findOne({ where: data.controller_id })
                .then((controller) => {
                    if (controller.dataValues.userId != user.dataValues.id) {
                        res.status(400)
                            .json({
                                message: 'You are not authorized to create a plant on this controller'
                            });
                        return;
                    }

                    plant_model.create(data)
                        .then((data) => {
                            res.status(201)
                                .json({
                                    message: 'Plant created'
                                });
                            return;
                        })
                        .catch((error) => {
                            res.status(500)
                                .json({
                                    message: 'Creating plant failed',
                                    error: error.toString()
                                });
                            return;
                        })
                })
                .catch((error) => {
                    res.status(500)
                        .json({
                            message: 'Controller not found',
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

function getPlantsFromController(req, res) {
    var controller_id = req.params.id;
    if (!controller_id) {
        res.status(400)
            .json({
                message: 'controller_id required'
            });
        return;
    }
    
    user_controller.getUser(req, res)
        .then((user) => {
            plant_model.findAll({ attributes: ['id', 'name'], where: { controller_id: controller_id} })
                .then((plants) => {
                    res.status(200)
                        .json({
                            message: 'Plants found',
                            plants: plants
                        });

                    return;
                })
                .catch((error) => {
                    res.status(500)
                        .json({
                            message: 'Plant not found',
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

function updatePlant(req, res){
    var defaults = settings.settings.plants;
    var plant_id = req.body.plant_id;
    var data = {
        name: req.body.name,
        sensor_pin: req.body.sensor_pin,
        pump_pin: req.body.pump_pin,
        trigger_percentage: req.body.trigger_percentage,
        sensor_type: req.body.sensor_type,
        pump_time: req.body.pump_time
    }

    if (!plant_id) {
        res.status(400)
            .json({
                message: 'Error: plant_id required'
            });
        return;
    }
    if (!data.name) {
        data.name = defaults.default_name;
    }
    if (!data.sensor_pin) {
        data.sensor_pin = defaults.default_sensor_pin
    }
    if (!data.pump_pin) {
        data.pump_pin = defaults.default_pump_pin
    }
    if (!data.trigger_percentage || data.trigger_percentage < defaults.trigger_percentage.min || data.trigger_percentage > defaults.trigger_percentage.max) {
        data.trigger_percentage = defaults.trigger_percentage.default;
    }
    if (!data.pump_time || data.pump_time < defaults.pump_time.min || data.pump_time > defaults.pump_time.max) {
        data.pump_time = defaults.pump_time.default;
    }
    if (!data.sensor_type || data.sensor_type != ("digital" || "analog")) {
        data.sensor_type = defaults.default_sensor_type;
    }

    user_controller.getUser(req,res)
    .then((user) => {
        plant_model.findOne({where: {id: plant_id}})
        .then((plant) => {
            controller_model.findOne({where: {id: plant.dataValues.controllerId}})
            .then((controller) => {
                if(controller.dataValues.userId == user.dataValues.id){
                    plant_model.update(data, {where: {id: plant_id}})
                    .then((updated_plant) => {
                        res.status(200)
                        .json({
                            message: 'Plant Updated',
                            plant: updated_plant
                        });
                        return;
                    })
                    .catch((error) => {
                        res.status(500)
                        .json({
                            message: 'Updating Controller Failed',
                            error: error.toString()
                        });
                        return;
                    });
                }
                else{
                    res.status(400)
                    .json({
                        message: 'You are not allowed to access ressource',
                        error: error.toString()
                    });
                return; 
                }
            })
            .catch((error) => {
                res.status(500)
                    .json({
                        message: 'Controller not found',
                        error: error.toString()
                    });
                return;
            });
        })
        .catch((error) => {
            res.status(500)
                .json({
                    message: 'Plant not found',
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

module.exports = plantController;