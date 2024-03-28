const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const { createToken, validateToken } = require('../utils/token');


router.get('/login', (req, res) => {
    res.render('./index/login_page');
});


router.get('/register', (req, res) => {
    res.render('./index/register_page');
});

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ msg: `User already exists` })
        };
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        user = new User({
            email,
            username,
            password: hashedPassword
        });

        await user.save();

        // create the token
        const token = createToken(user._id);

        // storing the token in the cookie in a 'token' variable
        res.cookie('token', token, {
            withcredentials: true,
            httpOnly: false,
        });

        res.redirect('/login');

    } catch (error) {
        res.status(500).json({ msg: `Error registration occured` })
    }

});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ msg: `Invalid Credentials` });
        }

        const token = createToken(user._id);
        // store the token in a cookie called "token"
        res.cookie('token', token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.redirect('/articles');
        // res.render('./articles/index');

    } catch (error) {
        res.status(500).json({ success: false, msg: `Authentication Error` })
    }
});

router.post('/logout', (req, res) => {
    res.redirect('/');
});

module.exports = router;