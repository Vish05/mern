const {validationResult} = require("express-validator");

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
    
    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password,
        places: []
    });

    console.log(createdUser);

    try {
        await createdUser.save();
    } catch(err) {
        const error = new HttpError(
            'Singing up failed, please try again..',
            500
        );
        return next(error);
    }

    res.status(201).json({user:createdUser});
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

    if(!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Your Username or Password is incorrect..!!',
            401
        );
        return next(error);
    }

    res.status(201).json({
        message:'Logged In..', 
        user: existingUser.toObject({getters:true})
    });
}

exports.getUsers = getUsers;
exports.singUp = singUp;
exports.login = login;

