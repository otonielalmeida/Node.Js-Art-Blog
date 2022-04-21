const jwt = require('jsonwebtoken');
var express = require('express')
var cookieParser = require('cookie-parser')

var app = express()
app.use(cookieParser())

module.exports = function (req, res, next) {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}

/* module.exports = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token){
        return res.sendStatus(403);
    }
    try {
        const data = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userId = data._id;
        return next();
    } catch {
        return res.sendStatus(403);
    }
}; */
