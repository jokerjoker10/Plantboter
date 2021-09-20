const jwt = require("jsonwebtoken");
const config = require("../settings").getSettings();

const authUser = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if(!token){
        return res.status(403)
        .json({
            message: "No authentification token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, config.auth.access_token_key);
        req.jwt_decode = decoded;
    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid Token"
        });
    }

    return next()
}

module.exports = authUser;