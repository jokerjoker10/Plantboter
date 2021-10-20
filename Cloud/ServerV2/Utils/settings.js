const fs = require('fs');


function getSettings() {
    const configPath = process.env.CONFIG_PATH || './Config';
    var obj = JSON.parse(fs.readFileSync(configPath + "/config.json", 'utf-8'));
    
    obj.auth.access_token_key = process.env.ACCESS_TOKEN_KEY;
    obj.auth.refresh_token_key = process.env.REFRESH_TOKEN_KEY;
    
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