const express = require('express');
const router = require('express').Router();
router.use(express.static('view'));
const verify = require ('./verifyToken');

router.get('/', verify, (req, res) => {
    res.render('newPost.ejs')
})

router.post('/', async (req, res) => {
    
})

module.exports = router;
