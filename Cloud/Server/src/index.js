// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const {startDatabase} = require('../database/mongo');

let apiRoutes = require('../routes/apiroute');
let frontRoutes = require('../routes/frontroute');

// defining the Express app
const app = express();

// Enable preflight requests for all routes
app.use(cors());
  
// adding Helmet for API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// adding morgan to log HTTP requests
app.use(morgan('combined'));

//endpoints
app.use('/api', apiRoutes);
app.use('/front', frontRoutes);

// starting the server
app.listen(5103, () => {
    console.log('listening on port 5103');
});