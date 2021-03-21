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
    const user = req.user
    res.json({
        loggedIn: true,
        user
    })
    
})

module.exports.signOut = asyncHandler((req,res) => {
    res.clearCookie('access_token')
    res.json({success:true})
})


module.exports.profile = asyncHandler(async (req,res) => {
    let user = await User.findOne({username:req.params.username},'username email profilePic description')
    if(!user){
        res.status(404)
        throw new Error('User does not exist')
    }

    let campgrounds = await Campground.find({author:user})

    const followers = await Follower.find({following:user}).countDocuments();
    const following = await Follower.find({follower:user}).countDocuments();

    const data = {user,campgrounds,followers,following}
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
    const followers = await Follower.find({following:user}).populate('follower','username email profilePic')
    const following = await Follower.find({follower:user}).populate('following','username email profilePic')
    const data = {user,campgrounds,followers,following}
    res.json(data)
})

module.exports.facebookOAuth = asyncHandler(async(req,res) => {
    const token = signToken(req.user)
    res.cookie('access_token',token,{httpOnly:true})
    res.json({success: 'true' })
})

module.exports.linkGoogle = asyncHandler(async (req,res) => {
    res.json({success: true,methods:req.user.methods,message: 'Successfully linked account with google'})
})


module.exports.linkFacebook = asyncHandler(async (req,res) => {
    res.json({success: true,methods:req.user.methods,message: 'Successfully linked account with facebook'})
})

module.exports.unLinkGoogle = asyncHandler(async (req,res) => {
    const googleStrPos = req.user.methods.indexOf('google')
    if(googleStrPos === -1){
        res.status(404)
        throw new Error('You have not linked your google account')
    }
    if (req.user.google) {
      req.user.google = undefined
    }
    // Remove 'google' from methods array
    
    if (googleStrPos >= 0) {
      req.user.methods.splice(googleStrPos, 1)
    }
    await req.user.save()

    // Return something
    res.json({ 
      success: true,
      methods: req.user.methods, 
      message: 'Successfully unlinked account from Google' 
    });
}) 

module.exports.unLinkFacebook = asyncHandler(async (req,res) => {
    const facebookStrPos = req.user.methods.indexOf('facebook')
    if( facebookStrPos === -1){
        res.status(404)
        throw new Error('You have not linked your facebook account')
    }
    // Delete Facebook sub-object
    if (req.user.facebook) {
      req.user.facebook = undefined
    }
    // Remove 'facebook' from methods array
    
    if (facebookStrPos >= 0) {
      req.user.methods.splice(facebookStrPos, 1)
    }
    await req.user.save()

    // Return something?
    res.json({ 
      success: true,
      methods: req.user.methods, 
      message: 'Successfully unlinked account from Facebook' 
    });
})