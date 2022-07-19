const { v4: uuidv4 } = require('uuid');
const {validationResult} = require("express-validator");

const HttpError = require('../models/http-error');

let DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Vishal Tanna',
        email: 'vishal.tanna@test.com',
        password: 'tester'
    }
];


const getUsers = (req,res,next) => {
    res.json({users: DUMMY_USERS});
}

const singUp = (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        throw new HttpError('Invalid input passed, please check your data', 422)
    }
    
    const { name,email,password } = req.body;

    const hasUser = DUMMY_USERS.find(u=> {
        return u.email === email
    });

    if(hasUser) {
        throw new HttpError('Email Already Exist..!!', 422)
    }

    const createdUser = {
        id: uuidv4(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(createdUser);
    res.status(201).json({user:createdUser});
}

const login = (req,res,next) => {
    const { email,password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u=> {
        return u.email === email
    });

    if(!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identified user, credentails seems to be wrong..!!', 401)
    }

    res.status(201).json({message:'Logged In..'});
}

exports.getUsers = getUsers;
exports.singUp = singUp;
exports.login = login;

