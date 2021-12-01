const app = require('express')();
const auth = require('../Utils/Middleware/auth');

const userRoute = require('./Front/user.route');
const mailRoute = require('./Front/mail.route');
const settingsRoute = require('./Front/settings.route');
const authRoute = require('./Front/auth.route');
const controllerRoute = require('./Front/controller.route');
const plantRoute = require('./Front/plant.route');
const apiRoute = require('./Front/api.route');

app.get('/', function(req, res) {
    res.send('Front Route: Please Read the documentation for information on usage.');
});

app.use('/user', userRoute);
app.use('/auth', authRoute)
app.use('/mail', mailRoute);
app.use('/settings', settingsRoute);
app.use('/controller', auth, controllerRoute);
app.use('/plant', auth, plantRoute);
app.use('/api', auth, apiRoute)

module.exports = app;