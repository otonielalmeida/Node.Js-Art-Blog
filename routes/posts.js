const express = require('express');
const router = require('express').Router();
const verify = require ('./verifyToken');
const Post = require('./../model/Post');
const res = require('express/lib/response');
router.use(express.static('view'));
const fs = require('fs');


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
  
    res.render('posts.ejs' , {
        "pages": pages,
        "loadPosts": loadPosts
    });
});

router.post('/', (req, res) => {
    res.clearCookie("jwt");
    res.redirect('/user/login');
})

router.get('/delete/:id', verify, async (req, res) => {
    console.log(req.body)
    await Post.findByIdAndDelete({_id: req.params.id});
    res.redirect('/managePosts');
    /* fs.unlink('../view/img' + Post.find(ObjectId(_id))) */
    }
); 


module.exports = router;