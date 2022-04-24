const express = require('express');
const router = require('express').Router();
const verify = require ('./verifyToken');
const Post = require('./../model/Post');
router.use(express.static('view'));

router.get('/', verify,  async (req, res) => {
    var pageNumber = (req.query.page == null) ? 1 : req.query.page;
    var perPage = 3;
    var startFrom = (pageNumber - 1) * perPage;    
    var total = await Post.find().count();
    var pages = Math.ceil(total / perPage);
    var loadPosts = await Post.find()
        .sort({ "uploadDate" : -1 })
        .skip(startFrom)
        .limit(perPage);
    console.log(pages)
    res.render('posts.ejs' , {
        "pages": pages,
        "loadPosts": loadPosts
    });
});

router.post('/', (req, res) => {
    res.clearCookie("jwt");
    res.redirect('/api/user/login');
})

module.exports = router;