const jsonwebtoken = require("jsonwebtoken");
require('dotenv').config();

const fetchUser = (req, res, next) => {
    //Get the user from the jwt token and add id to req object
    const token = req.header("authToken");
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

module.exports = fetchUser;