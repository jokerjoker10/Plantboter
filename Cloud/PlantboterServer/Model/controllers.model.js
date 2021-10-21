const Sequelize = require('sequelize');
const db = require('../Database/database');
const users = require('./users.model');

const Controllers = db.define('controllers', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cycle_time: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
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

Controllers.belongsTo(users);

module.exports = Controllers;
