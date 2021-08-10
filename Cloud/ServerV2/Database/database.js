const { Sequelize } = require('sequelize');
const config = require('../config.json');

const db = new Sequelize(
    config.database.database,
    config.database.username,
    config.database.password,
    {
        host: config.database.host,
        dialect: 'mysql',

        pool: config.database.pool
    }
)

module.exports = db;