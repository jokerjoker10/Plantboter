const Sequelize = require('sequelize');
const db = require('../Database/database');

const controllers = require('./controllers');
const plants = require('./plants');
const api_keys = require('./apikeys');
const users = require('./users');

const logs = db.define('logs', {
    id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    log_source: {
        type: Sequelize.ENUM('plant', 'controller', 'system', 'user'),
        allowNull: false
    },
    action: {
        type: Sequelize.ENUM(
            'moisture_level',
            'pump_action',
            'system_boot',
            'api_key_change',
            'update',
            'error'
        ),
        allowNull: false
    },
    data: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: '{}'
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

logs.belongsTo(controllers, {foreignKey: {allowNull: true}});
logs.belongsTo(plants, {foreignKey: {allowNull: true}});
logs.belongsTo(api_keys, {foreignKey: {allowNull: true}});
logs.belongsTo(users, {foreignKey: {allowNull: true}});