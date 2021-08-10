const { cryptoRandomString } = require('crypto-random-string');
const bcrypt = require('bcrypt');

// get crypt session key
function getSessionCrypt() {
    return cryptoRandomString({length: 255, type: 'base64'});
}

// encrypts passwodd to be saved in database
function cryptPassword(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err)
            return callback(err);

        bcrypt.hash(password, salt, function(err, hash) {
            return callback(err, hash);
        });
    });
}

// compare a plain password to a hashed to find out if it 
function comparePassword(plainpass, hashword, callback) {
    bcrypt.compare(plainpass, hashword, function(err, result){
        return err == null?
            callback(null, result):
            callback(err)
    });
}

module.exports = {
    getSessionCrypt,
    cryptPassword,
    comparePassword
}