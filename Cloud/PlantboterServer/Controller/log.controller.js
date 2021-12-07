const settings = require('../Utils/settings').getFrontendSettings();
const log_model = require('../Model/logs.model');
const plant_model = require('../Model/plants.model');
const controller_model = require('../Model/controllers.model');
const user_controller = require('../Controller/users.controller');

// page index and definition for export
const logController = {
    apiLogPlant: apiLogPlant,
}

function apiLogPlant(req, res){
    var data = {
        plant_id: req.body.plant_id,
        action: req.body.log_action,
        data: req.body.log_data
    }

    if(!data.plant_id){
        res.status(400)
        .status({
            message: "plant_id required"
        });
        return;
    }

    var action_list = ["moisture_level", "pump_action"]
    if(action_list.includes(data.action) == false){
        res.status(400)
        .json({
            message: "Action is either not allowed on plants or is missing"
        });
        return;
    }

    if(typeof data.data != 'object' || Array.isArray(data.data) || data.data == null){
        res.status(400)
        .status({
            message: "The data format is not right"
        });
        return;
    }

    plant_model.findOne({where: {controllerId: req.controller_id, id: data.plant_id}})
    .then((plant) => {
        if(!plant){
            res.status(500)
            .json({
                message: "Plant no found"
            }) 
            return; 
        }
        else {
            log_model.create({
                plantId: data.plant_id,
                log_source: 'plant',
                action: data.action,
                data: data.data
            })
            .then(() => {
                res.status(201)
                .json({
                    message: "Plant Logged"
                });
                return;
            })
            .catch((error) => {
                res.status(500)
                .json({
                    message: "Error saving log",
                    error: error.toString()
                }) 
                return; 
            });
        }
    })
    .catch((error) => {
        res.status(500)
        .json({
            message: "Error finding plant",
            error: error.toString()
        });
        return;
    });
}

module.exports = logController;
