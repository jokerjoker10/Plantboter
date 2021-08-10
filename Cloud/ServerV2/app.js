const express = require('express');

const apiroute = require('./Routes/apiroute');
const frontroute = require('./Routes/frontroute')

const cors = require('cors');

const app = express();

app.use('/api/v1', cors(), apiroute);
app.use('/front', frontroute);

module.exports = app;