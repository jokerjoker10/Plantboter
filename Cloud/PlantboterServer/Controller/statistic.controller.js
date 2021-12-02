const settings = require('../Utils/settings').getFrontendSettings();
const plant_model = require('../Model/plants.model');
const controller_model = require('../Model/controllers.model');
const user_controller = require('../Controller/users.controller');

// page index and definition for export
const statisticController = {
    getPlantDashboard: getPlantDashboard,
}

function getPlantDashboard(req, res){
    user_controller.getUser(req, res)
    .then((user) => {
        controller_model.findAll({where: {userId: user.dataValues.id}})
        .then((controllers) => {

            var controllerids = []

            controllers.forEach((controller) => {
                controllerids.push(controller.dataValues.id);
            })

            plant_model.findAll({where: {id: controllerids}, attributes: ['id', 'name']})
            .then((plants) => {
                // TODO Implement Log Data
                res.status(200)
                .json({
                    message: "Plants found",
                    plant_list: plants
                });
                return;
            })
            .catch((error) => {
                res.status(500)
                    .json({
                        message: 'Plants not found',
                        error: error.toString()
                    });
                return;
            });

        })
        .catch((error) => {
            res.status(500)
                .json({
                    message: 'Controllers not found',
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

module.exports = statisticController;