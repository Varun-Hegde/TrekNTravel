const express = require('express')
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')

const Campground = require('../models/campgroundModel')

const router = express.Router()


//   @desc   Get all Campgrounds
//   @route  GET api/campgrounds
//   @access Public
router.get(
    '/',
    asyncHandler(async(req,res) => {
        const campgrounds = await Campground.find({})
        res.json(campgrounds)
    })        
)


//   @desc   Get a particular Campground
//   @route  GET api/campgrounds/:id
//   @access Public
router.get(
    '/:id',
    asyncHandler(async(req,res) => {
        const campground = await Campground.findById(req.params.id)
        if(campground)
            res.json(campground)
        else
            res.status(404).json({message: 'Campground not found'})
    })        
)

module.exports = router