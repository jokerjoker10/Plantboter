const { contentSecurityPolicy } = require('helmet');
const {getDatabase} = require('../../database/mongo');
var ObjectId = require('mongodb').ObjectID;

const log = require('./log');

const apicollectionName = 'Controller';
const apilogcollectionName = 'Log';

async function getSetting(id){
    const database = await getDatabase();
    var con = await database.collection(apicollectionName).findOne({"_id": ObjectId(id)});

    var plant_list = [];
    await con.plants.forEach(async (element) => {
        plant_list.push({
            name: element.name,
            img: element.img,
            sensor_pin: element.sensor_pin,
            sensor_type: element.sensor_type,
            pump_pin: element.pump_pin,
            trigger_percentage: element.trigger_percentage,
            pump_time: element.pump_time,
            log: element.log
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
                sensor_type: element.sensor_type,
                pump_pin: element.pump_pin,
                trigger_percentage: element.trigger_percentage,
                pump_time: element.pump_time,
                log: element.log
            })
        };

        con_list.push({
            _id: con._id,
            api_key: con.api_key,
            name: con.name,
            plants: plant_list,
            cycle_time: con.cycle_time,
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
