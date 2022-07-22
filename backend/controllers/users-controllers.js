const {validationResult} = require("express-validator");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req,res,next) => {

    let users;
    try {
        users = await User.find({}, '-password');
    } catch(err) {
        const error = new HttpError(
            'Fetching Users Failed, please try again later',
            500
        );
        return next(error);
    }
    res.json({users: users.map((user) => user.toObject({getters: true}))});
}

const singUp = async (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        const error = new HttpError(
            'Invalid input passed, please check your data',
            422
        );
        return next(error);
    }
    
    const { name,email,password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({email: email});
    } catch(err) {
        const error = new HttpError(
            'Signing Up Failed, please try again later...',
            500
        );
        return next(error);
    }

    if(existingUser) {
        const error = new HttpError(
            'User exists already, please login instead',
            422
        );
        return next(error);
    }

    let hashPassword;
    try {
        hashPassword = await bcrypt.hash(password, 12);
    } catch(err) {
        const error = new HttpError(
            'Could Not Create user.. Please try again later..',
            500
        );
        return next(error);
    }
    
    
    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password:hashPassword,
        places: []
    });

    try {
        await createdUser.save();
    } catch(err) {
        const error = new HttpError(
            'Singing up failed, please try again..',
            500
        );
        return next(error);
    }

    let token;
    try {
        token = await jwt.sign(
            {userId: createdUser.id, email: createdUser.email}, 
            'supersecret_dont_share', 
            {expiresIn: '1h'}
        );
    } catch(err) {
        const error = new HttpError(
            'Singing up failed, please try again..',
            500
        );
        return next(error);
    }

    res.status(201).json({
        userId:createdUser.id,
        email: createdUser.email,
        token: token
    });
}

const login = async (req,res,next) => {
    const { email,password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({email: email});
    } catch(err) {
        const error = new HttpError(
            'Login Failed, please try again later...',
            500
        );
        return next(error);
    }

    if(!existingUser) {
        const error = new HttpError(
            'Your Username or Password is incorrect..!!',
            401
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
            'Could not log you in, please check your credentails and try again..!!',
            500
        );
        return next(error);
    }

    if(!isValidPassword) {
        const error = new HttpError(
            'Your Username or Password is incorrect..!!',
            403
        );
        return next(error);
    }

    let token;
    try {
        token = await jwt.sign(
            {userId: existingUser.id, email: existingUser.email}, 
            'supersecret_dont_share', 
            {expiresIn: '1h'}
        );
    } catch(err) {
        const error = new HttpError(
            'Logging failed, please try again..',
            500
        );
        return next(error);
    }

    res.status(201).json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    });
}

exports.getUsers = getUsers;
exports.singUp = singUp;
exports.login = login;

