const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');

// route modules
const apiroute = require('./apiroute');
const frontroute = require('./frontroute');
const db = require('../Database/database');

app.use(bodyParser.json());

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