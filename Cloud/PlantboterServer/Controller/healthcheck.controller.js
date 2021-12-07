const mail = require('../Utils/mail');
const https = require('https');
const http = require('http');
const { sequelize } = require('../Model/users.model');

const settings = require('../Utils/settings').getFrontendSettings();

const healthCheckController = {
    simpleHealthCheck: simpleHealthCheck,
    extendedHealthCheck: extendedHealthCheck
}

function simpleHealthCheck(req, res){
    res.status(200)
    .json({
        message: "Server Online"
    });
}

async function extendedHealthCheck(req, res){
    var error_list = [];
    var good_list = [ "api_server" ];
    
    // frontend server
    var https_error = false;
    try {
        var frontend_response = await https.get(settings.domains.frontend);
        if (frontend_response.statusCode != 200){
            error_list.push("ui_server");
        }
        else {
            good_list.push("ui_server");
        }
    }
    catch(e){
        https_error = true;
    }
    if(https_error){
        try {
            var frontend_response = await http.get(settings.domains.frontend);
            frontend_response.on("error", () => {});
            if (!frontend_response){
                error_list.push("ui_server");
            }
            else {
                good_list.push("ui_server");
                error_list.push("ui_server_no_cert");
            }
        }
        catch(e){
            error_list.push("ui_server");
        }
    }

    // mail server
    var mail_response = await mail.sendTestMail();
    if(!mail_response){
        error_list.push("mail_server");
    }
    else {
        good_list.push("mail_server");
    }

    // database server
    var [db_results, db_metadata] = await sequelize.query("SELECT 1*1 as result");
    if (!db_results){
        error_list.push("db_server");
    }
    else {
        if(db_results[0].result == 1){
            good_list.push("db_server");
        }
        else {
            error_list.push("db_server");
        }
    }
    
    var status = error_list.length > 0 ? 500 : 200;
    res.status(status)
    .json({
        message: status == 200 ? "All Systems online" : "System not completly online",
        good_services: good_list,
        error_list: error_list
    });
    return;
}

module.exports = healthCheckController;
