
const fs = require("fs");
const {validationResult} = require("express-validator");
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/locations');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req,res,next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).exec();
    } catch(err) {
        const error = new HttpError(
            'Something went wrong.. could not find a place',
            500
        );
        return next(error);
    }

    if(!place) {
        const error = new HttpError('Could not find place for the provided id..!!',404);
        return next(error);
    }
    res.json({place:place.toObject({getters:true})});
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
  
    // let places;
    let userWithPlaces;
    try {
      userWithPlaces = await User.findById(userId).populate('places');
    } catch (err) {
      const error = new HttpError(
        'Fetching places failed, please try again later',
        500
      );
      return next(error);
    }
    //if (!places || places.length === 0) {
    if (!userWithPlaces || userWithPlaces.places.length === 0) {
      return next(
        new HttpError('Could not find places for the provided user id.', 404)
      );
    }
  
    res.json({
      places: userWithPlaces.places.map(place =>
        place.toObject({ getters: true })
      )
    });
};

const createPlace = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return (
            new HttpError('Invalid input passed, please check your data', 422)
        )
    }

    const {title, description,address,creator}  = req.body;
    let coordinate = getCoordsForAddress(address);

    const createdPlace =  new Place({
        title,
        description,
        address,
        location: coordinate,
        image: req.file.path,
        creator
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch(err) {
        const error = new HttpError(
            'Could not find user by provided Id..!!',
            500
        );
        return next(error);
    }

    if(!user) {
        const error = new HttpError(
            'Could not find user by provided Id..!!',
            500
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch(err) {
        const error = new HttpError(
            'Creating place failed, please try again',
            500
        );
        return next(error);
    }

    res.status(201).json({place:createdPlace});
}

const updatePlace = async (req, res, next) => {

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(
            new HttpError('Invalid input passed, please check your data', 422)
        )
    }
    
    const {title, description}  = req.body;
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch {
        const error = new HttpError(
            'Something Went wrong. Could not update the place',
            500
        );
        return next(error);
    }
    
    place.title = title
    place.description = description;

    try {
        await place.save();
    } catch {
        const error = new HttpError(
            'Something Went wrong. Could not update the place',
            500
        );
        return next(error);
    }

    res.status(200).json({place:place.toObject({getters: true})});
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch {
        const error = new HttpError(
            'Something Went wrong. Could not delete the place',
            500
        );
        return next(error);
    }

    if(!place) {
        const error = new HttpError(
            'Could not find place for this id.',
            404
        );
        return next(error);
    }

    const imagePath = place.image;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session: sess});
        place.creator.places.pull(place);
        await place.creator.save({session: sess});
        await sess.commitTransaction();
    } catch {
        const error = new HttpError(
            'Something Went wrong. Could not delete the place',
            500
        );
        return next(error);
    }

    fs.unlink(imagePath, err => {
        console.log(err);
    })
    
    res.status(200).json({message: 'Place Deleted Successfully..!!'});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;  
exports.deletePlace = deletePlace;  