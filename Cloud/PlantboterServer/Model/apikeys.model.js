const Sequelize = require('sequelize');
const db = require('../Database/database');
const controllers = require('./controllers.model');

const apikeys = db.define('apiKeys', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    expire_at: {
        type: Sequelize.DATE,
        allowNull: true,
    }
},
{
    underscored: true
});

apikeys.belongsTo(controllers);

module.exports = apikeys;