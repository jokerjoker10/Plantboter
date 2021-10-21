const Sequelize = require('sequelize');
const db = require('../Database/database');
const controllers = require('./controllers.model');

const plants = db.define('plants', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sensor_pin: {
        type: Sequelize.TINYINT.UNSIGNED
    },
    pump_pin: {
        type: Sequelize.TINYINT.UNSIGNED
    },
    trigger_percentage: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
    },
    sensor_type: {
        type: Sequelize.ENUM('digital', 'analog'),
        allowNull: false,
        defaultValue: 'analog'
    },
    pump_time: {
        type: Sequelize.MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 10000
    }
},
{
    underscored: true
});

plants.belongsTo(controllers);
