const asyncHandler = require('express-async-handler')
const Campground = require('../models/campgroundModel')
const Review = require('../models/reviewModel')


module.exports.getAllCampgrounds = asyncHandler(async(req,res) => {
    const campgrounds = await Campground.find({})
    if(campgrounds)
        res.json(campgrounds)
    else{
        res.status(404)
        throw new Error("No Campgrounds found")
    }
}) 

module.exports.getParticularCampground = asyncHandler(async(req,res,next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    if(campground)
        res.json(campground)
    else{
        res.status(404)
        throw new Error("Campground not found ")
    }     
})

module.exports.postNewCampground = asyncHandler(async(req,res) => {        
    const campground = new Campground(req.body)
    await campground.save()
    res.status(201)
    res.json(campground)
})

module.exports.updateCampground = asyncHandler( async (req,res) => {
    if(!req.body)
        req.body = {}

    const campground = await Campground.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        
    if(!campground){
        res.status(404)
        throw new Error("Campground not found")
    }
    res.status(200).json(campground)
})

module.exports.deleteCampground = asyncHandler(async (req,res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id)
    if(!campground){
        res.status(404)
        throw new Error("Campground not found")
    }
    res.status(200).json(campground)
})

module.exports.postNewReview = asyncHandler( async (req,res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        res.status(404)
        throw new Error('Campground not found')
    }
    const review = new Review(req.body);
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.status(201)
    res.json(campground)
})

module.exports.deleteReview = asyncHandler( async (req,res) => {
    const {id,reviewId} = req.params
    const campground = await Campground.findById(id)
    const review = await Review.findById(reviewId)
    if(!campground){
        res.status(404)
        throw new Error('Campground not found')
    }
    if(!review){
        res.status(404)
        throw new Error('Review not found')
    }
    await Campground.findByIdAndUpdate(id,{$pull : {reviews:reviewId}},{new:true,runValidators:true})
    const deletedReview = await Review.findByIdAndDelete(reviewId) 
    res.status(200).json(deletedReview)
})