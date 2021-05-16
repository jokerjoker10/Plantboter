const { contentSecurityPolicy } = require('helmet');
const {getDatabase} = require('../../database/mongo');
var ObjectId = require('mongodb').ObjectID;

const apicollectionName = 'Controller';
const apilogcollectionName = 'Log';

async function getSetting(id){
    const database = await getDatabase();
    var con = await database.collection(apicollectionName).findOne({"_id": ObjectId(id)});

    var plant_list = [];
    await con.plants.forEach(async (element) => {
        var _log = await database.collection(apilogcollectionName).findOne({"_id": ObjectId(element.log)});
        plant_list.push({
            name: element.name,
            img: element.img,
            sensor_pin: element.sensor_pin,
            pump_pin: element.pump_pin,
            trigger_percentage: element.trigger_percentage,
            log: _log
        })
    });

    return con;
}

async function getSettings(){
    const database = await getDatabase();
    var cons = await database.collection(apicollectionName).find().toArray();

    var con_list = [];
    for(const con of cons){
        var plant_list = [];
        for(const element of con.plants) {
            plant_list.push({
                name: element.name,
                img: element.img,
                sensor_pin: element.sensor_pin,
                pump_pin: element.pump_pin,
                trigger_percentage: element.trigger_percentage,
                log: await database.collection(apilogcollectionName).findOne({"_id": ObjectId(element.log)})
            })
        };

        con_list.push({
            _id: con._id,
            api_key: con.api_key,
            name: con.name,
            plants: plant_list,
            command: con.command
        })
    }
    
    return con_list
}

async function confirmExecutedCommand(id){
    const database = await getDatabase();
    await database.collection(apicollectionName).updateOne({"_id": ObjectId(id)},{$set:{"command": null}});
}

module.exports = {
    getSettings,
    getSetting,
    confirmExecutedCommand
}
