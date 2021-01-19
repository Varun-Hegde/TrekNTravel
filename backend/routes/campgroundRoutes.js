const express = require('express')
const passport = require('passport')

const {validateCampground,validateReview} = require('../validations/campgroundValidation')
const CampgroundController = require('../controllers/campgroundControllers')

const router = express.Router()

const passportJWT = passport.authenticate('jwt', { session: false });

const {isCampgroundOwner,isReviewOwner} = require('../middlewear/campgroundMiddlewear')
//   @desc   Get all Campgrounds
//   @route  GET api/campgrounds
//   @access Public
router.get('/',CampgroundController.getAllCampgrounds)


//   @desc   Get a particular Campground
//   @route  GET api/campgrounds/:id
//   @access Public
router.get('/:id',CampgroundController.getParticularCampground)

//   @desc   Post a new Campground
//   @route  POST api/campgrounds/
//   @access Public
router.post('/',validateCampground,passportJWT,CampgroundController.postNewCampground)

//   @desc   Edit a particular Campground
//   @route  PUT api/campgrounds/:id
//   @access Public
router.put('/:id',validateCampground,passportJWT,isCampgroundOwner,CampgroundController.updateCampground)


//   @desc   Delete a particular Campground
//   @route  DELETE api/campgrounds/:id
//   @access Public
router.delete('/:id',passportJWT,isCampgroundOwner,CampgroundController.deleteCampground)

//   @desc   POST a new review
//   @route  POST api/campgrounds/:id/reviews
//   @access Public
router.post('/:id/reviews',passportJWT,validateReview,CampgroundController.postNewReview)


//   @desc   Delete a review
//   @route  DELETE api/campgrounds/:id/reviews/:reviewId
//   @access Public
router.delete('/:id/reviews/:reviewId',passportJWT,isReviewOwner,CampgroundController.deleteReview)

module.exports = router