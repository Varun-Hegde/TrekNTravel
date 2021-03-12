const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Follower = require('../models/followersModel')


module.exports.addFollower = asyncHandler(async (req,res,next) => {
    const {username} = req.params
    if(req.user.username === username){
        res.status(422)
        throw new Error("You can't follow yourself")
    }
    const user = await User.findOne({username:username})
    
    if(!user){
        res.status(404);
        throw new Error('User with this username not found')
    }
    const followData = await Follower.findOne({follower:req.user._id , following:user._id})
    if(followData){
        res.status(200)
        throw new Error('You are aldready following this user')
    }
    const followers = new Follower({
        follower: req.user._id,
        following: user
    })

    await followers.save()

    res.status(200).json({
        success : true
    })
})

module.exports.removeFollower = asyncHandler(async(req,res,next) => {
    const username = req.params.username
    if(req.user.username === username){
        res.status(422)
        throw new Error("You can't follow yourself")
    }
    const user = await User.findOne({username:username})
    
    if(!user){
        res.status(404);
        throw new Error('User with this username not found')
    }

    const followData = await Follower.findOne({follower:req.user._id , following:user._id})

    if(!followData){
        res.status(404)
        throw new Error("You haven't followed this user yet")
    }

    await Follower.findByIdAndDelete(followData._id)

    res.status(200).json({
        success: true,
        msg: "Successfully unfollowed this user"
    })
})

module.exports.status = asyncHandler(async (req,res,next) => {
    const username = req.params.username
    
    const user = await User.findOne({username:username})
    
    if(!user){
        res.status(404);
        throw new Error('User with this username not found')
    }

    const followData = await Follower.findOne({follower:req.user._id , following:user._id})
    if(followData){
        res.json({follow:true})
    }else{
        res.json({follow: false})
    }
})