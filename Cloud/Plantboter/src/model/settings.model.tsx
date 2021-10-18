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
    trigger_percentage: DefaultValues;
    pump_time: DefaultValues;
}

interface DefaultValues {
    default: number;
    min: number;
    max: number;
    allow_change: Boolean;
}