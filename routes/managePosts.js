const express = require('express');
const router = require('express').Router();
router.use(express.static('view'));
const verify = require ('./verifyToken');
const multer = require('multer');
var fs = require('fs');
//model
const Post = require('./../model/Post');

router.post('/', async (req, res) => {
    
    
})

router.get('/', verify, async (req, res) => {
    var loadPosts = await Post.find()
        .sort({ "uploadDate" : -1 })
    res.render('managePosts.ejs', {
        "loadPosts": loadPosts
    });
    
});

module.exports = router;