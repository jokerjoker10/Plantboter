const app = require('express')();

const userRoute = require('./user.route');
const mailRoute = require('./mail.route')

app.get('/', function(req, res) {
    res.send('Front Route: Please Read the documentation for information on usage.');
});

app.use('/user', userRoute);
app.use('/mail', mailRoute);

module.exports = app;