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

// defining routes
app.use('/apiv1', cors(), inputCheck.checkInput, apiroute);
app.use('/front', cors({origin: config.domains.frontend}), inputCheck.checkInput, frontroute);

// sync database
db.sync()
    .then(() => {
        console.log('Database Syncend');
    })
    .catch(err => {
        console.log('Database Sync failed: ' + err);
    });

module.exports = app;