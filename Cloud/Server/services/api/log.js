const { contentSecurityPolicy } = require('helmet');
const {getDatabase} = require('../../database/mongo');
const settingService = require('./settings');
var ObjectId = require('mongodb').ObjectID;

const apicollectionName = 'Log';

async function logPlant(id, req){
    var body = req.body;
    var log_id = req.params.log_id;

    const database = await getDatabase();

    //check body
    if(body.type === null && body.value === null){
        return false;
    }
    
    var newBody = {
        type: body.type,
        value: Number(body.value),
        timestamp: new Date()
    };

    //update db
    await database.collection(apicollectionName).findOneAndUpdate({"_id": ObjectId(log_id)},{$push: {"logs":newBody}},{upsert:true});
    return true;
} 

async function getLog(id){
    const database = await getDatabase();
    return await database.collection(apicollectionName).findOne({"_id": ObjectId(id)}, { projection: {"logs": {$slice: -100}}});
}

async function getDetailedLog(log_id, start, end){
    const database = await getDatabase();
    return await database.collection(apicollectionName).findOne({"_id": ObjectId(id)}, { projection: {"logs": {$slice: [start, end]}}});
}

module.exports = {
    logPlant,
    getLog,
    getDetailedLog,

};
