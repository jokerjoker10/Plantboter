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
            if(data.log == log_id){
                reloadPlantList = true;
            }
        })
        
        if(reloadPlantList){
            controller.plants.forEach(data => {
                if(data.log != log_id){
                    plantList.push(data)
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

    var newController = {
        api_key: controller.api_key,
        name: req.body.name,
        plants: controller.plants,
        command: controller.command
    }
    
    await database.collection(controllerCollectionName).findOneAndUpdate({"_id": ObjectId(controller._id)},{$set: newController},{upsert:true});

    return true;
}

async function updatePlant(controller_id, log_id, req){
    const database = await getDatabase();

    //get if controller exists
    var controller = await getSetting(controller_id);
    
    if(!controller){
        return false;
    }

    var newPlantlist = []

    controller.plants.forEach(async plant => {
        if(plant.log == log_id){
            var newPlant = {
                name: req.body.name,
                img: req.body.img,
                sensor_pin: req.body.sensor_pin,
                pump_pin: req.body.pump_pin,
                trigger_percentage: req.body.trigger_percentage,
                log: plant.log
            };
            newPlantlist.push(newPlant);
        }
        else{
            newPlantlist.push(plant);
        }
    })
    await database.collection(controllerCollectionName).findOneAndUpdate({"_id": ObjectId(controller._id)},{$set: {"plants": newPlantlist}},{upsert:true});
}


module.exports = {
    addController,
    addPlantToController,
    removeController,
    removePlant,
    updateController,
    updatePlant
}
