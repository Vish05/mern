const express = require("express");
const {check} = require("express-validator");

const placesController = require('../controllers/places-controllers');
const fileUPload = require('../middlerware/file-upload');
const checkAuth = require('../middlerware/check-auth');

const router = express.Router();



router.get('/:pid', placesController.getPlaceById);

router.get('/user/:uid', placesController.getPlacesByUserId);

router.use(checkAuth);

router.post('/', 
    fileUPload.single('image'),
    [
        check('title').not().isEmpty(),
        check('description').isLength({min:5}),
        check('address').not().isEmpty(),
    ]
    , placesController.createPlace);

router.patch('/:pid', [
        check('title').not().isEmpty(),
        check('description').isLength({min:5})
    ], placesController.updatePlace);

router.delete('/:pid', placesController.deletePlace);

module.exports = router;