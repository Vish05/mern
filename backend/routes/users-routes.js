const express = require("express");
const {check} = require("express-validator");

const usersController = require('../controllers/users-controllers');
const fileUPload = require('../middlerware/file-upload');


const router = express.Router();

router.get('/', usersController.getUsers);

router.post('/signup', 
    fileUPload.single('image'),
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min:6})
    ], usersController.singUp);

router.post('/login', usersController.login);

module.exports = router;