const express = require('express');
const router = require('express').Router();
router.use(express.static('view'));
const verify = require ('./verifyToken');
const multer = require('multer');

//model
const Post = require('./../model/Post');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, __dirname + '/../view/img');
    },
    filename: function (request, file, callback) {
        callback(null, file.originalname);
    },
});

const upload = multer({ storage });

router.get('/', verify, async (req, res) => {
    res.render('newPost.ejs');
});

router.post('/', upload.single('image'), async (req, res) => {
    
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
        res.redirect('/posts')
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
