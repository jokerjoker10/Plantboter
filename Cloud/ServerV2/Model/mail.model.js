const Sequelize = require('sequelize');
const db = require('../Database/database');

const users = require('./users.model');

const Mail = db.define('mail', {
    id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    mail_type: {
        type: Sequelize.ENUM(
            'mail_verification',
            'password_reset'
        ),
        allowNull: false
    },
    mail_send_report: {
        type: Sequelize.JSON
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

Mail.belongsTo(users, {foreignKey: {allowNull: false}});

module.exports = Mail