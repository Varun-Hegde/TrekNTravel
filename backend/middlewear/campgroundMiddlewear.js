const Campground = require('../models/campgroundModel')
const Review = require('../models/reviewModel')
const asyncHandler = require('express-async-handler')


module.exports.isCampgroundOwner =asyncHandler(async  (req,res,next) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        res.status(404)
        throw new Error("Campground not found")
    }
    if(campground.author.equals(req.user._id)){
        return next()
    }else{
        res.status(403)
        throw new Error("You do not have permission to do that")
    }
})

module.exports.isReviewOwner =asyncHandler(async  (req,res,next) => {
    const review = await Review.findById(req.params.reviewId)
    if(!review){
        res.status(404)
        throw new Error("Review not found")
    }
    if(review.author.equals(req.user._id)){
        return next()
    }else{
        res.status(403)
        throw new Error("You do not have permission to do that")
    }
})