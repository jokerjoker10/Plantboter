const fs = require('fs');

const configPath = process.env.CONFIG_PATH || './Config';

var obj = JSON.parse(fs.readFileSync(configPath + "/config.json", 'utf-8'));

function getSettings() {
    var tokenKeys = getTokenKeys();
    obj.auth.access_token_key = tokenKeys.access_token_key;
    obj.auth.refresh_token_key = tokenKeys.refresh_token_key;
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

function saveTokenKey(access_token_key, refresh_token_key) {
    if (!fs.existsSync(configPath + "/TokenKeys")) {
        fs.mkdirSync(configPath + "/TokenKeys")
    }

    fs.writeFileSync(configPath + "/TokenKeys/access_token_key.txt", access_token_key, 'utf-8', (error) => {
        if (error) throw 'Error Writing Key to file: ' + error;
    });
    fs.writeFileSync(configPath + "/TokenKeys/refresh_token_key.txt", refresh_token_key, 'utf-8', (error) => {
        if (error) throw 'Error Writing Key to file: ' + error;
    });
}

function getTokenKeys() {
    var access_token_key = '';
    var refresh_token_key = '';
    if (fs.existsSync(configPath + "/TokenKeys/access_token_key.txt") && fs.existsSync(configPath + "/TokenKeys/access_token_key.txt")) {
        access_token_key = fs.readFileSync(configPath + "/TokenKeys/access_token_key.txt", 'utf-8');
        refresh_token_key = fs.readFileSync(configPath + "/TokenKeys/refresh_token_key.txt", 'utf-8');
    }
    else if(!(!process.env.ACCESS_TOKEN_KEY && !process.env.REFRESH_TOKEN_KEY)) {
        access_token_key = process.env.ACCESS_TOKEN_KEY;
        refresh_token_key = process.env.REFRESH_TOKEN_KEY;
    }

    return {
        access_token_key: access_token_key,
        refresh_token_key: refresh_token_key
    }
}

module.exports = {
    getSettings: getSettings,
    getFrontendSettings: getFrontendSettings,
    saveTokenKey: saveTokenKey,
    getTokenKeys: getTokenKeys
}