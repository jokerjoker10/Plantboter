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
app.use('/front', cors({origin: config.domains.frontend}), inputCheck.checkInput, frontroute);

app.use(cors("*"))
app.use('/api/v1', inputCheck.checkInput, apiroute);

// healthcheck route (always gives back 200)
app.get('/healthcheck', (req, res) => {
    res.status(200)
    .json({
        message: "System running"
    });
    return;
});

// sync database
db.sync()
    .then(() => {
        console.log('Database Syncend');
    })
    .catch(err => {
        console.log('Database Sync failed: ' + err);
    });

module.exports = app;