const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    let errors = { email: '', username: '', password: '' };

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email does not exist';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    if (err.code === 11000) {
        errors.username = 'That username already exists';
    }

    console.log(err.message);

    // duplicate error
    if (err.code === 11000) {
        errors.email = 'That email already exists';
    }

    //validation error
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'Y u readin this? huh?', {
        expiresIn: maxAge
    });
}



module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { email, username, password } = req.body;
    
    try {
        const user = await User.create({ email, username, password });
        const token = createToken(user._id);

        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password, rememberMe } = req.body;
    
    console.log(rememberMe);

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);

        if (rememberMe === true) {
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        }
        else {
            res.cookie('jwt', token, {httpOnly: true, expires: 0});
        }


        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
} 