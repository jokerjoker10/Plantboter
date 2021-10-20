const settings = require('../Utils/settings').getSettings();
const keyToken = require('./tokenkey');
const mailer = require('../Utils/mail');

async function initServer(){
    // testing if token key ar available
    if(!process.env.ACCESS_TOKEN_KEY || !process.env.REFRESH_TOKEN_KEY){
        console.log("\n##### Access or Refresh Token Not Found #####");
        console.log("For Security Reasons both codes will be renewed")
        console.log("Generating new keys...\n");

        process.env.ACCESS_TOKEN_KEY = keyToken.createTokenKey();
        process.env.REFRESH_TOKEN_KEY = keyToken.createTokenKey();

        console.log('The Access Token Keys need to be the same on all instances');
        console.log('############### Access Token Key:\n' + process.env.ACCESS_TOKEN_KEY + '\n');
        console.log('############### Refresh Token Key:\n' + process.env.REFRESH_TOKEN_KEY + '\n');
    }

    // testing if mail connection is avialable
    console.log('##### Testing Mail Service #####\n')
    try{
        await mailer.sendTestMail();
    }
    catch(error){

        throw 'Error: Mail connection false: ' + error;
    };

    console.log('\n##### Mail Connection Successfull #####\n')
}

module.exports = {initServer: initServer}