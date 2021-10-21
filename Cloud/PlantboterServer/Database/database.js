const { Sequelize } = require('sequelize');
const config = require('../Utils/settings').getSettings();

const db = new Sequelize(
    config.database.database,
    config.database.username,
    config.database.password,
    {
        host: config.database.host,
        dialect: 'mysql',
        
        logging: false,
        pool: config.database.pool
    }
)

module.exports = db;