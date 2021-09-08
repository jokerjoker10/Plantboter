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
    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
},
{
    underscored: true
});

apikeys.belongsTo(controllers);
