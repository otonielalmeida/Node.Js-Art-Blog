const express = require('express');
const router = require('express').Router();
router.use(express.static('view'));
const verify = require ('./verifyToken');
const path = require('path');
//model
const Post = require('./../model/Post');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, __dirname + '/../view/img');
    },
    filename: function (request, file, callback) {
        callback(null, file.originalname);
    },
});

const upload = multer({ storage });

router.get('/', verify, (req, res) => {
    res.render('newPost.ejs')
})

router.post('/', upload.single('image'), async (req, res) => {
    
    console.log(req.body)
    const post = new Post({
        author: req.body.author,
        title: req.body.title,
        image: req.file.filename,
        uploadDate: req.body.uploadDate,
        date: req.body.date,
        description: req.body.description
    });
    try {
        const Savedpost = await post.save();
        res.redirect('/api/posts')
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
