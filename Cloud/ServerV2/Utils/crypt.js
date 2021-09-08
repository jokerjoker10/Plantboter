const bcrypt = require('bcrypt');

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
let comparePassword = new Promise(function(plainpass, hashword) {
    bcrypt.compare(plainpass, hashword, (err, result) => {
        if(err){
            throw err;
        }
        
        return result;
    });
});

module.exports = {
    cryptPassword,
    comparePassword
}