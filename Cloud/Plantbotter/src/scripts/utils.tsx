import  {Defaults} from './settings'
import {getAllController, getLog, getLang, log, controller, plant} from './superStore';

var lang = getLang();

function getAllPlants(con: Array<controller>): Array<plant>{
    var plant_list: Array<plant> = [];
    con.forEach(element => {
        element.plants.forEach(plant => {
            plant_list.push(plant);
        });
    });
    return plant_list;
}

function getAllPlantsIndexList(con: Array<controller>): Array<string>{
    var plant_list: Array<string> = [];
    con.forEach(element => {
        element.plants.forEach(plant => {
            plant_list.push(plant.log._id);
        });
    });
    return plant_list;
}

function getPlantDataFromIndex(plant_index: string, con: Array<controller>): plant {
    //get plant data by index
    con.forEach(element => {
        element.plants.forEach(plant => {
            if(plant.log._id == plant_index){
                return plant;
            }
        });
    });

    //if nothing is found
    return {
        name: "",
        img: "",
        sensor_pin: 0,
        pump_pin: 0,
        trigger_percentage: 0,
        log: {
            _id: "",
            logs: []
        },
    }
}

//calc last time til contact
function getLastContact(log: log): string {

    if(log.logs == undefined || log.logs.length == 0){
        return "--"
    }

    //declare const
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const _MS_PER_HOUR = 1000 * 60 * 60; 
    const _MS_PER_MIN = 1000 * 60;
    const _MS_PER_SEC = 1000;
    
    const then = new Date(log.logs[log.logs.length - 1].timestamp).getTime();
    const now = new Date().getTime();

    var output = ""

    //generate output
    //this will only show one Value
    output = Math.floor((now - then) / _MS_PER_SEC).toString() + lang.home.TimePassedFormatText.Second;
    if(Math.floor((now - then) / _MS_PER_SEC) >= 60){
        output = Math.floor((now - then) / _MS_PER_MIN).toString() + lang.home.TimePassedFormatText.Minute;
    }
    if(Math.floor((now - then) / _MS_PER_MIN) >= 60){
        output = Math.floor((now - then) / _MS_PER_HOUR).toString() + lang.home.TimePassedFormatText.Hours;
    }
    if(Math.floor((now - then) / _MS_PER_HOUR) >= 24){
        output = Math.floor((now - then) / _MS_PER_DAY).toString() + lang.home.TimePassedFormatText.Days;
    }

    return output;
}

function getLastSensorValue(log: log){
    if(log.logs == undefined || log.logs.length == 0){
        return "--"
    }

    var index = log.logs.length - 1;
    var isLog: boolean = false;
    var output: Number = 0;
    while(!isLog){
        if(log.logs[index].type == "value_log"){
            output = log.logs[index].value;
            isLog = true;
        }
        index--;
    }
    return output;
}

//loading img
function loadImg(plant: plant){
    if(plant.img != null || plant.img != ""){
        return(<>
            <div className="imageContainer">
                <img src={plant.img} className="image"/>
            </div>
        </>)
    }
    else{
        return(<></>);
    }
}

function getLogRedirect(log: log){
    return "/log/" + log._id;
}

export {
    getAllPlants,
    getLastContact,
    getLastSensorValue,
    loadImg,
    getLogRedirect,
    getAllPlantsIndexList,
    getPlantDataFromIndex
}
