const config = require('../Utils/settings');
const keyToken = require('./tokenkey');
const mailer = require('../Utils/mail');
const icons = require('../Utils/consoleEmoji');
const db = require('../Database/database');

const initServer = () => {
    return new Promise((resolve, reject) => {

        var message = '';

        console.log('\n##### Initializing Server! #####')
        {
            // testing if token key ar available
            process.stdout.write('Token Keys: ');
            var keys = config.getTokenKeys();
            if (!keys.access_token_key || !keys.refresh_token_key) {

                var access_token_key = keyToken.createTokenKey();
                var refresh_token_key = keyToken.createTokenKey();

                config.saveTokenKey(access_token_key, refresh_token_key);


                message += '\n##### Access or Refresh Token Not Found #####\n';
                message += 'For Security Reasons both codes will be renewed\n';
                message += 'The Access Token Keys need to be the same on all instances\n';
                message += '############### Access Token Key:\n' + access_token_key + '\n';
                message += '############### Refresh Token Key:\n' + refresh_token_key + '\n\n';
                config.getSettings();
                console.log(icons.warning);
            }
            else{
                console.log(icons.success)
            }
        }
        {
            // testing if mail connection is avialable
            process.stdout.write('Mail Service: ');

            mailer.sendTestMail()
                .then(() => {
                    console.log(icons.success);

                    //testing mail
                    process.stdout.write('Database Auth: ');
                    db.authenticate()
                        .then(() => {
                            console.log(icons.success);
                            console.log('##### Initializing done! #####');
                            console.log(message);
                            resolve();
                        })
                        .catch(err => {
                            console.log(icons.error)
                            reject('Database Connection Error: ' + err);
                            return;
                        });
                })
                .catch((error) => {
                    console.log(icons.error)
                    reject('Error: Mail connection false: ' + error);
                    return;
                });
        }
    });

}

module.exports = { initServer: initServer }