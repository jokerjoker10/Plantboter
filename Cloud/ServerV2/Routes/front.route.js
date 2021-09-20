const app = require('express')();

const userRoute = require('./Front/user.route');
const mailRoute = require('./Front/mail.route');
const settingsRoute = require('./Front/settings.route');
const authRoute = require('./Front/auth.route');

app.get('/', function(req, res) {
    res.send('Front Route: Please Read the documentation for information on usage.');
});

app.use('/user', userRoute);
app.use('/auth', authRoute)
app.use('/mail', mailRoute);
app.use('/settings', settingsRoute);

module.exports = app;