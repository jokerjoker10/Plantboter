let router = require('express').Router();
let authService = require('../services/api/auth');

let apisettings = require('../services/api/settings');
let apilog = require('../services/api/log');
let apiutil = require('../services/api/util')

//settings
router.get('/getallcontroller', async function (req, res) {
    var settings = await apisettings.getSettings();
    res.send(settings);
});

router.get('/getcontroller/:id', async function (req, res) {
    res.send(await apisettings.getSetting(req.params.id));
});

//controller and plants
router.post('/createNewController', async function (req, res) {
    res.send(await apiutil.addController());
});

router.post('/addPlantToController/:controller_id', async function (req, res) {
    if(!await apiutil.addPlantToController(req.params.controller_id)){
        res.statusCode = 400;
    }
    res.send();
});

router.post('/removeController/:controller_id', async function (req, res) {
    res.send(await apiutil.removeController(req.params.controller_id));
});

router.post('/removePlantFromController/:log_id', async function (req, res) {
    res.send(await apiutil.removePlant(req.params.log_id));
});

router.put('/updateController/:controller_id', async function(req, res){
    res.send(await apiutil.updateController(req.params.controller_id, req))
})

router.put('/updatePlant/:controller_id/:log_id', async function(req, res){
    res.send(await apiutil.updatePlant(req.params.controller_id, req.params.log_id, req))
})

router.get('/getlog/:log_id', async function(req, res){
    res.send(await apilog.getLog(req.params.log_id))
})

module.exports = router;
