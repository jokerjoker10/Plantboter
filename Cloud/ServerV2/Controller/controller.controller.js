const settings = require('../Utils/settings').getFrontendSettings();
const controller_model = require('../Model/controllers.model');
const user_controller = require('../Controller/users.controller');

const controllerController = {
    createController: createController,
    getController: getController,
    getControllerInfo: getControllerInfo,
    updateController: updateController
}

function createController(req, res){
    var name = req.body.name;
    var cycle_time = req.body.cycle_time;
    var cycle_config = settings.settings.controller.cycle_time;

    if(!cycle_time || !cycle_config.allow_change ||
        (cycle_time >= cycle_config.min && 
        cycle_time <= cycle_config.max)){
    
        cycle_time = cycle_config.default;
    }

    if(!name){
        name = 'New Controller';
    }

    user_controller.getUser(req, res)
    .then((user) => {
        controller_model.create({
            userId: user.dataValues.id,
            name: name,
            cycle_time: cycle_time 
        })
        .then((controller) => {
            res.status(200)
            .json({
                message: "Controller Created",
                controller: controller
            });
            return;
        })
        .catch((error) => {
            res.status(500)
            .json({
                message: "Creating Controller Failed",
                error: error
            });
            return;
        })
    })
    .catch((error) => {
        res.status(500)
        .json({
            message: "User not found",
            error: error
        });
        return;
    });
}

function getController(req, res){
    user_controller.getUser(req, res)
    .then((user) => {
        controller_model.findAll({where: {userId: user.dataValues.id}})
        .then((controllers) => {
            res.status(200)
            .json({
                message: "Controller list found",
                controller_list: controllers
            });
            return;
        })
        .catch((error) => {
            res.status(500)
            .json({
                message: "Getting controllers failed!",
                error: error
            });
            return;
        });
    })
    .catch((error) => {
        res.status(500)
        .json({
            message: "User not found",
            error: error
        });
        return;
    });
}

function getControllerInfo(req, res){
    if(!req.body.controller_id){
        res.status(400)
        .json({
            message: "controller_id required"
        });
        return;
    }

    user_controller.getUser(req, res)
    .then((user) => {
        controller_model.findOne({where: {id: req.body.controller_id, userId: user.dataValues.id}})
        .then((controller) => {
            res.status(200)
            .json({
                message: "Controller found",
                controller: controller
            });
            return;
        })
        .catch((error) => {
            res.status(500)
            .json({
                message: "Getting controllers failed!",
                error: error
            });
            return;
        });
    })
    .catch((error) => {
        res.status(500)
        .json({
            message: "User not found",
            error: error
        });
        return;
    });
}

function updateController(req, res){
    if(!req.body.name){
        req.status(400)
        .json({
            message: "name required"
        });
        return;
    }
    
    if(!req.body.cycle_time){
        req.status(400)
        .json({
            message: "cycle_time required"
        });
        return;
    }

    user_controller.getUser(req, res)
    .then((user) => {
        controller_model.update(req.body, {where: {id: req.params.id, userId: user.dataValues.id}})
        .then((controller) => {
            res.status(200)
            .json({
                message: "Controller updated"
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(500)
            .json({
                message: "Updating controller failed!",
                error: error
            });
            return;
        });
    })
    .catch((error) => {
        res.status(500)
        .json({
            message: "User not found",
            error: error
        });
        return;
    });
}

module.exports = controllerController;