const bcrypt = require('bcrypt');

// encrypts passwodd to be saved in database
function cryptPassword(password, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            return callback(err);

        bcrypt.hash(password, salt, function (err, hash) {
            return callback(err, hash);
        });
    });
}

// compare a plain password to a hashed to find out if it 
const comparePassword = (plainpass, hashword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainpass, hashword, (err, result) => {
            if (err) {
                reject(err);
            }

            resolve(result);
        });
    })

};

function generateApiKey(){
    var output = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for(var i = 0; i < 255; i++){
        output += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return output;
}

module.exports = {
    cryptPassword : cryptPassword,
    comparePassword : comparePassword,
    generateApiKey : generateApiKey,
}