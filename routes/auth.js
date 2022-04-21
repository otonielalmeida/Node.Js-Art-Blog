const express = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const { redirect } = require('express/lib/response');

router.use(express.static('view'));

router.get('/register', (req, res) => {
    res.sendFile('register.html', {
        root: './view/'
    })
    /* res.send(`
    <form action='/api/user/register' method='POST'>
    Name: <input type='text' name="name">
    Email: <input type="text" name="email">
    Password: <input type="text" name="password">
    <button>Send</button>
    </form>
    `) */
});

router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

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
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/login', (req, res) => {
    res.sendFile('login.html', {
        root: './view'
    })
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or password is wrong');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: 3600
    });

    res.cookie('jwt', token) 
    res.redirect('/api/posts');
});

module.exports = router;


/* {
    "email": "lorenzo@mail.com",
    "password": "doggydoggy"
} */
