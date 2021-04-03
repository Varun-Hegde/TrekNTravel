const express = require('express');
const passport = require('passport');
const { validateCampground, validateReview } = require('../validations/campgroundValidation');
const CampgroundController = require('../controllers/campgroundControllers');

const router = express.Router();

const passportJWT = passport.authenticate('jwt', { session: false });

const { isCampgroundOwner, isReviewOwner } = require('../middleware/campgroundMiddleware');

router.get('/', CampgroundController.getAllCampgrounds); //Get all Campgrounds
router.get('/:id', CampgroundController.getParticularCampground); //Get a particular Campground
router.post('/', validateCampground, passportJWT, CampgroundController.postNewCampground); //Post a new Campground
router.put('/:id', validateCampground, passportJWT, isCampgroundOwner, CampgroundController.updateCampground); //Edit a particular Campground
router.delete('/:id', passportJWT, isCampgroundOwner, CampgroundController.deleteCampground); //Delete a particular Campground
router.post('/:id/reviews', passportJWT, validateReview, CampgroundController.postNewReview); //POST a new review
router.delete('/:id/reviews/:reviewId', passportJWT, isReviewOwner, CampgroundController.deleteReview); //Delete a review
router.post('/:id/like', passportJWT, CampgroundController.like); //Like Campground
router.put('/:id/reviews/:reviewId', passportJWT, isReviewOwner, validateReview, CampgroundController.editReview); //Edit a review

module.exports = router;
