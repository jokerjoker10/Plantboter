const PORT = process.env.PORT || 3001;

const server = require('./Routes/app');
const pkg = require('./package.json');
const gitVersion = require('git-tag-version');
const init = require('./Init/init');

// Connect to Database
const db = require('./Database/database');
db.authenticate()
    .then(() => {
        console.log('\nDatabase Connected\n');
    })
    .catch(err => {
        throw 'Database Connection Error: ' + err;
    });

console.log('\n### Initialising Server ###\n');
init.initServer();

// Start Server
server.listen(PORT, () => {
    console.log(`###############################################`);
    console.log(`${pkg.name} Online. Listening on Port ${PORT}`);
    console.log(`${pkg.name} Version: ${gitVersion()}`)
    console.log(`###############################################\n\n`);
})

// Close Connection to database on Shutrown
process.on('SIGTERM', () => {
    console.log(`${pkg.name} Shut down recieved`);
    process.exit(0);
})

module.exports = server;