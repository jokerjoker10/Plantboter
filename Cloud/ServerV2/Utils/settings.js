const fs = require('fs');
const { set } = require('../Routes/front.route');

function getSettings() {
    var obj = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
    obj.auth.token_key = obj.auth.token_key || process.env.TOKEN_KEY
    return obj
} 

function getFrontendSettings() {
    var settings = getSettings();

    var frontend_settings = {
        domains: settings.domains,
        allow_regestration: settings.auth.allow_regrestration,
        settings: settings.settings
    }
    
    return frontend_settings;
}

module.exports = {
    getSettings: getSettings,
    getFrontendSettings: getFrontendSettings
}