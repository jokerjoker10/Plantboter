let router = require('express').Router();
let authService = require('../services/api/auth');

let apisettings = require('../services/api/settings');
let apilog = require('../services/api/log');

router.get('/getsettings/:api_key', async function (req, res) {
    var id = await authService.auth(req.params.api_key)
    if(!id){
        res.statusCode = 401;
        res.send("error");
    }
    var settings = await apisettings.getSetting(id);
    settings.api_key = null;
    res.send(settings);
});

router.put('/executedecommand/:api_key', async function (req, res) {
    var id = await authService.auth(req.params.api_key)
    if(!id){
        res.statusCode = 401;
        res.send("error");
    }
    var id = await apisettings.confirmExecutedCommand(id);
    res.send();
});

router.post('/logplant/:api_key/:log_id', async function (req, res) {
    var id = await authService.auth(req.params.api_key)
    if(!id){
        res.statusCode = 401;
        res.send("error");
    }

    if(apilog.logPlant(id, req) === false){
        res.statusCode = 504;
    }
    
    res.send();
});

module.exports = router;
