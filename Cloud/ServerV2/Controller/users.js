const crypt = require('../Utils/crypt');
const user_model = require('../Model/users');
var usersController = {
    addUser: addUser,
    getUserById: getUserById,
    getUserBySession: getUserBySession,
    loginUser: loginUser,
    updateUser: updateUser,
    deleteUser: deleteUser
}

// adds a new user to the database
function addUser(_username, _email, _password) {
    let pass = "";
    crypt.cryptPassword(_password, function(err, hash) {
        if(!err)
            pass = hash;
        console.log("Error: Password Hashing Failed");
    });

    user_model.create({
        username: _username,
        email: _email,
        password = pass
    })
    .then((data) => {
        data.password = null;
        data.session = null;
        return data;
    })
    .catch((err) => {
        console.log(err);
    });
}

function getUserById(_id) {
    let user = await user_model.findAll({where: {id: _id}});
    user.password = null;
    user.session = null;
    return user;
}

function getUserBySession(_session) {
    let user = await user_model.findAll({where: {session: _session}});
    user.password = null;
    user.session = null;
    return user;
}

function loginUser(_email, _password) {
    user_model.findAll({where: {email: _email}})
    .then((data) => {
        let user_logged_in = false;
        crypt.comparePassword(_password, data.password, function(err, result) {
            if(!err)
                user_logged_in = result;
        });
    
        if(user_logged_in){
            let session_id = crypt.getSessionCrypt();
            user_model.update({session: session_id}, {where: {id: data.id}})
            .then(() => {
                return (true, session_id);
            })
            .catch((error) => {
                console.log(error);
                return (false, null);
            });
        }
        return (false, null);
    })
    .catch((error) => {
        console.log(error);
        return (false, null);
    });
}

function updateUser(user, _id) {
    user_model.update({email: user.email}, {where: {id: _id}})
    .then((data) => {
        data.password = null;
        data.session = null;
        return data;
    })
    .catch((error) => {
        console.log(error);
    });
}

function deleteUser(_id) {
    user_model.destroy({where: {id: _id}})
    .then(() => {
        console.log("Deleted User with id: " + _id);
    })
    .catch((error) => {
        console.log(error);
    })
}