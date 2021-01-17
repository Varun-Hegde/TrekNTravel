const JWT = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

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
    const {email,password} = req.body 
    let foundUser = await User.findOne({email})
    if(foundUser){
        res.status(400);
        throw new Error('A user with this email aldready exists')
    }
    const newUser = new User({
        email,
        password
    })
    const createdUser = await newUser.save();
    const token = signToken(createdUser)
    res.cookie('access_token',token,{httpOnly: true})
    res.json({success: true,createdUser})
})  

module.exports.signIn = asyncHandler(async(req,res,next) => {
    const token = signToken(req.user)
    res.cookie('access_token',token,{httpOnly: true})
    res.json({success: true})
})

module.exports.status = asyncHandler(async(req,res,next) => {
    res.json({
        loggedIn: true,
        user: {
            _id: req.user._id,
            email:req.user.email
        }
    })
})

module.exports.signOut = asyncHandler((req,res) => {
    res.clearCookie('access_token')
    res.json({success:true})
})