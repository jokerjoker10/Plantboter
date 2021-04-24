const { contentSecurityPolicy } = require('helmet');
const {getDatabase} = require('../../database/mongo');

const apicollectionName = 'Controller';

async function auth(apiKey){
    const database = await getDatabase();
    var controller = await database.collection(apicollectionName).findOne({api_key: apiKey});
    
    if(!controller){
        return null;
    }
    return controller._id;
}

module.exports = {
    auth
}
