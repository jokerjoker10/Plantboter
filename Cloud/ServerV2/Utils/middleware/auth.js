const jwt = require("jsonwebtoken");
const config = require("../settings").getSettings();

const authUser = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if(!token){
        return res.status(403).send("No authentification token provided");
    }

    try {
        const decode = jwt.verify(token, config.settings.auth.token_key);
        req.user = decoded;
    }
    catch (err) {
        return res.status(401).send("Invalid Token");
    }

    return next()
}

module.exports = authUser;