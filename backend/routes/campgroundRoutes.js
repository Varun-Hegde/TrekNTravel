const express = require('express')
const passport = require('passport')
const {validateCampground,validateReview} = require('../validations/campgroundValidation')
const CampgroundController = require('../controllers/campgroundControllers')

const router = express.Router()

const passportJWT = passport.authenticate('jwt', { session: false });

const {isCampgroundOwner,isReviewOwner} = require('../middlewear/campgroundMiddlewear')


//   @desc   Get all Campgrounds
router.get('/',CampgroundController.getAllCampgrounds)


//   @desc   Get a particular Campground
router.get('/:id',CampgroundController.getParticularCampground)

//   @desc   Post a new Campground
router.post('/',validateCampground,passportJWT,CampgroundController.postNewCampground)



//   @desc   Edit a particular Campground
router.put('/:id',validateCampground,passportJWT,isCampgroundOwner,CampgroundController.updateCampground)


//   @desc   Delete a particular Campground
router.delete('/:id',passportJWT,isCampgroundOwner,CampgroundController.deleteCampground)

//   @desc   POST a new review
router.post('/:id/reviews',passportJWT,validateReview,CampgroundController.postNewReview)


//   @desc   Delete a review
router.delete('/:id/reviews/:reviewId',passportJWT,isReviewOwner,CampgroundController.deleteReview)

//   @desc   Like Campground
router.post('/:id/like',passportJWT,CampgroundController.like)


//   @desc   Edit a review
router.put('/:id/reviews/:reviewId',passportJWT,isReviewOwner,validateReview,CampgroundController.editReview)


module.exports = router
