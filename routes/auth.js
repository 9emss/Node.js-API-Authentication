const router = require("express").Router();
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { registerValidation, loginValidation } = require('../helper/ValidationSchema');

router.post("/register", async(req, res) => {

    // Validate before create data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking user already
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email telah terdaftar');

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });

    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Login
router.post("/login", async(req, res) => {

    // Validate before create data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking user already
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email atau password salah');

    // check if password correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Email atau password salah');

    // create an assign token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;