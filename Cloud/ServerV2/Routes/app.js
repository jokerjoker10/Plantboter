const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const inputCheck = require('../Utils/Middleware/inputcheck');

// route modules
const apiroute = require('./api.route');
const frontroute = require('./front.route');
const db = require('../Database/database');

app.use(bodyParser.json());
app.use(inputCheck.checkInput);

// defining routes
app.use('/api/v1', cors(), apiroute);
app.use('/front', frontroute);

// sync database
db.sync()
    .then(() => {
        console.log('Database Syncend');
    })
    .catch(err => {
        console.log('Database Sync failed: ' + err);
    });

module.exports = app;