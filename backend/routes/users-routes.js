const express = require("express");
const {check} = require("express-validator");

const usersController = require('../controllers/users-controllers');


const router = express.Router();

router.get('/', usersController.getUsers);

router.post('/signup', [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('email').isLength({min:6})
    ], usersController.singUp);

router.post('/login', usersController.login);

module.exports = router;