const { contentSecurityPolicy } = require('helmet');
const {getDatabase} = require('../../database/mongo');
const {genApiKey} = require('../rand');
const {getSetting, getSettings} = require('./settings')
var ObjectId = require('mongodb').ObjectID;

const controllerCollectionName = 'Controller';
const logCollectionName = 'Log';

async function addController(){
    const database = await getDatabase();

    var newController = {
        api_key: genApiKey(),
        name: "New Controller",
        plants: [],
        command: null 
    };
    var data = await database.collection(controllerCollectionName).insertOne(newController)
    return {id: data.insertedId};
}

async function reloadAPIKey(controller_id){
    const database = await getDatabase();

    //get if controller exists
    var controller = await getSetting(controller_id);
    
    if(!controller){
        return false;
    }

    await database.collection(controllerCollectionName).findOneAndUpdate({"_id": ObjectId(controller._id)},{$set: {"api_key":genApiKey()}},{upsert:true});
}

async function addPlantToController(controller_id){
    const database = await getDatabase();

    //get if controller exists
    var controller = await getSetting(controller_id);
    
    if(!controller){
        return false;
    }

    //insert log and get log id
    var newLog = {
        logs: []
    }

    var data = await database.collection(logCollectionName).insertOne(newLog);


    //insert plant to controller
    var newPlant = {
        name: "NewPlant",
        img: "",
        sensor_pin: 0,
        pump_pin: 0,
        trigger_percentage: 40,
        log: data.insertedId
    }
    await database.collection(controllerCollectionName).findOneAndUpdate({"_id": ObjectId(controller_id)},{$push: {"plants":newPlant}},{upsert:true});

    return true
}

async function removeController(controller_id){
    const database = await getDatabase();

    var controller = await getSetting(controller_id);

    controller.plants.forEach(async element => {
        await database.collection(logCollectionName).remove({_id: ObjectId(element.log)});
    });

    await database.collection(controllerCollectionName).remove({_id: ObjectId(controller_id)});
}

async function removePlant(log_id){
    const database = await getDatabase();

    var controllers = await getSettings();
    controllers.forEach(async controller => {
        var reloadPlantList = false;
        var plantList = [];

        controller.plants.forEach(data => {
            
            if(data.log._id == log_id){
                reloadPlantList = true;
            }
        })
        
        if(reloadPlantList == true){
            controller.plants.forEach(data => {
                if(data.log._id != log_id){
                    plantList.push({
                        name: data.name,
                        img: data.img,
                        sensor_pin: data.sensor_pin,
                        pump_pin: data.pump_pin,
                        trigger_percentage: data.trigger_percentage,
                        log: data.log._id
                    });
                }
            })

            await database.collection(logCollectionName).remove({_id: ObjectId(log_id)});
            await database.collection(controllerCollectionName).findOneAndUpdate({"_id": ObjectId(controller._id)},{$set: {"plants":plantList}},{upsert:true});
        }
    });
}

async function updateController(controller_id, req){
    const database = await getDatabase();

    //get if controller exists
    var controller = await getSetting(controller_id);
    
    if(!controller){
        return false;
    }

    console.log(req.body)

    var newController = {
        api_key: controller.api_key,
        name: req.body.name,
        plants: controller.plants,
        command: controller.command
    }
    
    await database.collection(controllerCollectionName).findOneAndUpdate({"_id": ObjectId(controller._id)},{$set: newController},{upsert:true});

    return true;
}

async function updatePlant(log_id, req){
    const database = await getDatabase();

    //get if controller exists
    var controller = await getSettings();
    
    if(!controller){
        return false;
    }

    var con = {};

    controller.forEach(data => {
        data.plants.forEach(plant => {
            if(plant.log._id == log_id){
                con = data; 
            }
        })
    });

    var newPlantlist = []

    con.plants.forEach(async plant => {
        if(plant.log._id == log_id){
            var newPlant = {
                name: req.body.name,
                img: req.body.img,
                sensor_pin: req.body.sensor_pin,
                pump_pin: req.body.pump_pin,
                trigger_percentage: req.body.trigger_percentage,
                log: plant.log._id
            };
            newPlantlist.push(newPlant);
        }
        else{
            newPlantlist.push({
                name: plant.name,
                img: plant.img,
                sensor_pin: plant.sensor_pin,
                pump_pin: plant.sensor_pin,
                trigger_percentage: plant.trigger_percentage,
                log: plant.log._id
            });
        }
    })
    await database.collection(controllerCollectionName).findOneAndUpdate({"_id": ObjectId(con._id)},{$set: {"plants": newPlantlist}},{upsert:true});
}


module.exports = {
    addController,
    addPlantToController,
    removeController,
    removePlant,
    updateController,
    updatePlant,
    reloadAPIKey
}
