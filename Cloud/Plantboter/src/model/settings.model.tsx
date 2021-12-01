export interface SettingsModel {
    domains: Domains;
    allow_regestration: Boolean;
    settings: Settings;
}

interface Domains {
    frontend: String;
    api: String;
}

interface Settings {
    controller: Controller;
    plants: Plants;
}

interface Controller{
    cycle_time: DefaultValues;
}

interface Plants{
    default_name: String;
    default_sensor_pin: Number;
    default_pump_pin: Number;
    default_sensor_type: String;
    trigger_percentage: DefaultValues;
    pump_time: DefaultValues;
}

interface DefaultValues {
    default: Number;
    min: Number;
    max: Number;
    allow_change: Boolean;
}