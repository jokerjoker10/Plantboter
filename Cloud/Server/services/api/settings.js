const { contentSecurityPolicy } = require('helmet');
const {getDatabase} = require('../../database/mongo');
var ObjectId = require('mongodb').ObjectID;

const apicollectionName = 'Controller';

async function getSetting(id){
    const database = await getDatabase();
    return await database.collection(apicollectionName).findOne({"_id": ObjectId(id)});
}

async function getSettings(){
    const database = await getDatabase();
    return  await database.collection(apicollectionName).find({}).toArray();
}

async function confirmExecutedCommand(id){
    const database = await getDatabase();
    await database.collection(apicollectionName).updateOne({"_id": id},{$set:{"command": null}});
}

module.exports = {
    getSettings,
    getSetting,
    confirmExecutedCommand
}
