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
        if(campgrounds)
            res.json(campgrounds)
        else{
            res.status(404)
            throw new Error("No Campgrounds found")
        }
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
        else{
            res.status(404)
            throw new Error("Campground not found")
        }     
    })        
)

//   @desc   Post a new Campground
//   @route  POST api/campgrounds/
//   @access Public
router.post(
    '/',
    asyncHandler(async(req,res) => {
        const campground = new Campground(req.body)
        await campground.save()
        res.status(201)
        res.json(campground)
    })
)

//   @desc   Edit a particular Campground
//   @route  PUT api/campgrounds/:id
//   @access Public
router.put(
    '/:id',
    asyncHandler( async (req,res) => {
        if(!req.body)
            req.body = {}

        const campground = await Campground.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        
        if(!campground){
            res.status(404)
            throw new Error("Campground not found")
        }
        res.status(200).json(campground)
    })
)


//   @desc   Delete a particular Campground
//   @route  DELETE api/campgrounds/:id
//   @access Public
router.delete(
    '/:id',
    asyncHandler(async (req,res) => {
        const campground = await Campground.findByIdAndDelete(req.params.id)
        if(!campground){
            res.status(404)
            throw new Error("Campground not found")
        }
        res.status(200).json(campground)
    }) 
)



module.exports = router