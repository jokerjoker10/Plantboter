const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const inputCheck = require('../Utils/Middleware/inputcheck');
const morgan = require('morgan');

const config = require('../Utils/settings').getSettings();
const db = require('../Database/database');

// route modules
const apiroute = require('./api.route');
const frontroute = require('./front.route');

// traffic logger
app.use(morgan('combined'));

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

module.exports = app;