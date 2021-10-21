const PORT = process.env.PORT || 3001;

const pkg = require('./package.json');
const gitVersion = require('git-tag-version');
const init = require('./Init/init');

init.initServer()
    .then(() => {
        // load modules after init
        const server = require('./Routes/app');
        const settings = require('./Utils/settings').getSettings();

        // Start Server
        server.listen(PORT, () => {
            console.log(`\n\n###############################################`);
            console.log(`${pkg.name} Online. Listening on Port ${PORT}`);
            console.log(`Version: ${gitVersion()}`);
            console.log(`Listening on: ${settings.domains.api}`);
            console.log(`###############################################\n\n`);
        })

        // Close Connection to database on Shutrown
        process.on('SIGTERM', () => {
            console.log(`${pkg.name} Shut down recieved`);
            process.exit(0);
        })

        module.exports = server;
    })
    .catch((error) => {
        console.log(error);
        return;
    });