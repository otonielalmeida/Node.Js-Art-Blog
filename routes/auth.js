const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const ejs = require('ejs');
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');


router.use(express.static('view'));

router.get('/register', (req, res) => {
    res.render('register.ejs');
});

router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);
    if (error) return res.render('registerError.ejs');

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.render('registerError.ejs');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.redirect('/api/posts');
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: 3600
        });
        res.cookie('jwt', token);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/login', (req, res) => {
    res.render('login.ejs')
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.render('loginError.ejs');

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.render('loginError.ejs');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.render('loginError.ejs');

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: 3600
    });

    res.cookie('jwt', token);
    res.redirect('/posts');
});

module.exports = router;


/* {
    "email": "lorenzo@mail.com",
    "password": "doggydoggy"
} */
