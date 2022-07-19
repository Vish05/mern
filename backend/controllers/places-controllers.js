const { v4: uuidv4 } = require('uuid');
const {validationResult} = require("express-validator");

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/locations');
const Place = require('../models/place');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
];

const getPlaceById = async (req,res,next) => {
    const placeId = req.params.pid;

    let place
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

const getPlacesByUserId = async (req,res,next) => {
    const userId = req.params.uid;
    
    let places
    try {
        places = await Place.find({creator:userId});
    } catch(err) {
        const error = new HttpError(
            'Something went wrong.. could not find a place',
            500
        );
        return next(error);
    }

    if(!places || places.length === 0) {
        const error = new HttpError('Could not find places for the provided userid..!!',404);
        return next(error);
    }

    res.json({place:places.map(place => place.toObject({getters:true}))});
}

const createPlace = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        throw new HttpError('Invalid input passed, please check your data', 422)
    }

    const {title, description,address,creator}  = req.body;
    let coordinate = getCoordsForAddress(address);

    const createdPlace =  new Place({
        title,
        description,
        address,
        location: coordinate,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
        creator
    });

    try {
        await createdPlace.save();
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
        throw new HttpError('Invalid input passed, please check your data', 422)
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

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;

    if(!DUMMY_PLACES.find((p) => p.id === placeId)) {
        throw new HttpError('Could not find a place for that id', 400);
    }

    DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
    res.status(200).json({message: 'Place Deleted Successfully..!!'});

}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;  
exports.deletePlace = deletePlace;  