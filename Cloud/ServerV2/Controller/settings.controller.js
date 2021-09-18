const settings = require('../Utils/settings').getFrontendSettings()

const settingsController = {
    getSettings: getSettings
}

function getSettings(req, res){
    res.status(200)
    .json({
        message: "Frontent settings",
        settings: settings
    });
    return;
}

module.exports = settingsController;