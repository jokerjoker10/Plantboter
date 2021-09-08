const fs = require('fs');

function getSettings() {
    var obj = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
    obj.auth.token_key = obj.auth.token_key || process.env.TOKEN_KEY
    return obj
} 

module.exports = {getSettings: getSettings}