const express = require('express');
const router = require('express').Router();
const verify = require ('./verifyToken');

router.use(express.static('view'));

router.get('/', verify, (req, res) => {
    res.render('posts.ejs')
})

router.post('/', (req, res) => {
    res.clearCookie("jwt");
    res.redirect('/api/user/login');
})

module.exports = router;