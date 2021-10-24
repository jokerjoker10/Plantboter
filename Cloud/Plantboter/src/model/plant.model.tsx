export interface PlantModel{
    id: Number,
    name: String,
    sensor_pin: Number,
    pump_pin: Number,
    trigger_percentage: Number,
    sensor_type: String,
    pump_time: Number,
    createdAt: Date,
    updatedAt: Date
}