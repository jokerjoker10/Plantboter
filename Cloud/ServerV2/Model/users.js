const Sequelize = require('sequelize');
const db = require('../Database/database');

const Users = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    session: {
        type: Sequelize.STRING
    },
    created_at: {
        type: Sequelize.TIME,
        allowNull: false
    }
});

module.exports = Users;