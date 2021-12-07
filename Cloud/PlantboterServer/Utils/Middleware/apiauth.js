const config = require("../settings").getSettings();
const api_key_model = require('../../Model/apikeys.model');

const authApi = (req, res, next) => {
    const api_key = req.headers["x-api-key"];
    
    if(!api_key){
        res.status(403)
        .json({
            message: "No API Key provided"
        });
        return;
    }
    
    api_key_model.findOne({where: {key: api_key}})
    .then((key) => {
        if(!key){
            return res.status(401)
            .json({
                message: "Api Key Invalid"
            });
        }

        if(key.dataValues.status != "active"){
            return res.status(401)
            .json({
                message: "Api Key Invalid. Reason: " + key.dataValues.status
            });
        }

        if(key.dataValues.expire_at != null && key.dataValues.expire_at < new Date()){
            api_key_model.update({status: "expired"}, {where: {key: api_key}})
            .then(() => {
                return res.status(401)
                .json({
                    message: "Api Key Invalid. Reason: expired"
                });
            })
            .catch(() => {
                return res.status(500)
                .json({
                    message: "Updating Api Key Failed!"
                });
            })
        }

        // all good and return

        req.controller_id = key.dataValues.controllerId;
        return next();
    })
    .catch((error) => {
        return res.status(500)
        .json({
            message: "Finding Api Key Failed!"
        });
    });
}

module.exports = authApi;