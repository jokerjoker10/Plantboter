import lang from '../lang/lang.json'
import  {Defaults} from './settings'

var _default = new Defaults();

export interface controller {
    _id: string;
    api_key: string;
    name: string;
    plants: Array<plant>;
    cycle_time: number;
    command: string
}

export interface controllerUpdate {
    name: string;
    cycle_time: number;
}

export interface plant {
    name: string;
    img: string;
    sensor_pin: number;
    sensor_type: string;
    pump_pin: number;
    trigger_percentage: number;
    pump_time: number;
    log: log;
}

export interface plantUpdate {
    name: string;
    img: string;
    sensor_pin: number;
    sensor_type: string;
    pump_pin: number;
    trigger_percentage: number;
    pump_time: number;
}

export interface log {
    _id: string;
    logs: Array<logs>;
}
export interface logs {
    type: string;
    value: Number;
    timestamp: string;
}

async function getAllController(){    
    var cons:Array<controller> = []
    
    var con: controller = {
        _id: "string",
        api_key: "string",
        name: "string",
        cycle_time: 0,
        plants: [],
        command: "string"
    };

    return await fetch(_default.DEFAULT_API_URL + _default.ENDPOINT_ALL_CONTROLLER)
    .then(response => response.json())
    .then(async function(data){
        data.forEach((element: any) => {
            con = {
                _id: element._id,
                api_key: element.api_key,
                name: element.name,
                cycle_time: element.cycle_time,
                plants: element.plants,
                command: element.command
            };
            cons.push(con);
        });
        return cons;
    })
}

async function getLog(id: any){
    var log: log = {
        _id: "string",
        logs: []
    };

    return await fetch(_default.DEFAULT_API_URL + _default.ENDPOINT_GET_LOG + "/" + id)
    .then(response => response.json())
    .then(function(data){return data})
}

function getLang(){
    return lang.de;
}

async function addController() {
    return fetch(_default.DEFAULT_API_URL + _default.ENDPOINT_CREATE_CONTROLLER, {method: "POST"});
}

async function removeController(con_id: string) {
    return fetch(_default.DEFAULT_API_URL + _default.ENDPOINT_REMOVE_CONTROLLER + "/" + con_id, {method: "POST"});
}

async function addPlant(con_id:string) {
    return fetch(_default.DEFAULT_API_URL + _default.ENDPOINT_ADD_PLANT + "/" + con_id, {method: "POST"});
}

async function removePlant(log_id: string) {
    return fetch(_default.DEFAULT_API_URL + _default.ENDPOINT_REMOVE_PLANT + "/" + log_id, {method: "POST"});
}

async function reloadApiKey(con_id: string) {
    return fetch(_default.DEFAULT_API_URL + _default.ENDPOINT_RELOAD_API_KEY + "/" + con_id, {method: "POST"});
}

async function updateController(con_id: string, updateData: controllerUpdate) {
    return fetch(_default.DEFAULT_API_URL + _default.ENDPOINT_UPDATE_CONTROLLER + "/" + con_id, 
    {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify(updateData)
    });
}

async function updatePlant(log_id: string, updateData: plantUpdate) {
    return fetch(_default.DEFAULT_API_URL + _default.ENDPOINT_UPDATE_PLANT + "/" + log_id, 
    {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify(updateData)
    });
}

export {
    getAllController,
    getLog,
    getLang,
    addController,
    removeController,
    addPlant,
    removePlant,
    reloadApiKey,
    updateController,
    updatePlant
}

