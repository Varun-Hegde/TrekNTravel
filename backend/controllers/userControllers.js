const JWT = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Campground = require('../models/campgroundModel')
const Follower = require('../models/followersModel')

const signToken = (user) => {
    const token = JWT.sign({
        iss: 'Varun Hegde',
        sub: user._id,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate()+1)   // current time + 1 day ahead
    },process.env.JWTSecret)
    return token
}

module.exports.signUp = asyncHandler(async(req,res,next) => {

    const {email,password,username} = req.body 
    let foundUser = await User.findOne({"local.email":email})
    if(foundUser){
        res.status(400);
        throw new Error('A user with this email aldready exists')
    }

    //Check if user exists with same google email
    foundUser = await User.findOne({"google.email":email})
    if(foundUser){
        res.status(400);
        throw new Error('A user with this email aldready exists')
    }
    
    const newUser = new User({
        methods: ['local'],
        username:username,
        email:email,
        age:18,
        local: {
            email: email,
            password: password
        }
    })
    const createdUser = await newUser.save();
    const token = signToken(createdUser)
    res.cookie('access_token',token,{httpOnly: true})
    res.json({success: true,createdUser})
})  

module.exports.signIn = asyncHandler(async(req,res,next) => {
    const token = signToken(req.user)
    res.cookie('access_token',token,{httpOnly: true})
    //res.cookie('access_token', token, {sameSite: 'strict',path: '/',httpOnly:true,secure:true),
    res.json({success: true})
})

module.exports.status = asyncHandler(async(req,res,next) => {
    res.json({
        loggedIn: true,
        user: {
            _id: req.user._id,
            email:req.user.email,
            username: req.user.username
        }
    })
})

module.exports.signOut = asyncHandler((req,res) => {
    res.clearCookie('access_token')
    res.json({success:true})
})


module.exports.profile = asyncHandler(async (req,res) => {
    const loggedInUser = req.user._id    
    const user = await User.findById(loggedInUser);
    const campground = await Campground.find({author:loggedInUser})
    const data = {
        user,
        campground
    }
    res.json(data)
})

module.exports.googleAuth = asyncHandler(async (req,res) => {
    const token = signToken(req.user)
    res.cookie('access_token',token,{httpOnly: true,})
    res.json({success: 'true' })
})

module.exports.getFullprofileInfo = asyncHandler(async (req,res) => {
    let user = await User.findById(req.user._id)
    if(!user){
        res.status(404)
        throw new Error('User does not exist')
    }
    
    const campgrounds = await Campground.find({author:user})
    user.campgrounds = campgrounds
    const followers = await Follower.find({following:user})
    const following = await Follower.find({follower:user})
    const data = {user,campgrounds,followers,following}
    res.json(data)
})