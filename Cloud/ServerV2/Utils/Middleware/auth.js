const jwt = require("jsonwebtoken");
const config = require("../settings").getSettings();

const authUser = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if(!token){
        return res.status(403).send("No authentification token provided");
    }

    try {
        const decoded = jwt.verify(token, config.auth.token_key);
        req.jwt_decode = decoded;
    }
    catch (err) {
        console.log(err)
        return res.status(401).send("Invalid Token");
    }

    return next()
}

module.exports = authUser;