const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const inputCheck = require('../Utils/Middleware/inputcheck');

const config = require('../Utils/settings').getSettings();
const db = require('../Database/database');

// route modules
const apiroute = require('./api.route');
const frontroute = require('./front.route');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(inputCheck.checkInput);

// defining routes
app.use('/apiv1', cors(), apiroute);
app.use('/front', cors(), frontroute);

// sync database
db.sync()
    .then(() => {
        console.log('Database Syncend');
    })
    .catch(err => {
        console.log('Database Sync failed: ' + err);
    });

module.exports = app;