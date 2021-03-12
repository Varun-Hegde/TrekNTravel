const express = require('express')
const router = express.Router()
const passport = require('passport')

const FollowController = require('../controllers/followControllers')

const passportJWT = passport.authenticate('jwt', { session: false });

router.post('/follow/:username',passportJWT,FollowController.addFollower)
router.delete('/unfollow/:username',passportJWT,FollowController.removeFollower)

module.exports = router