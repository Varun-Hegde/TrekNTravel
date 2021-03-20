const express = require('express')
const router = express.Router()
const passport = require('passport')
const passportConf = require('../passport')
const {validateUserSignIn,validateUserSignUp} = require('../validations/userValidations')
const UserController = require('../controllers/userControllers')

const passportLocal = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken',{session: false})
const passportFacebook = passport.authenticate('facebookToken',{session:false})

//SignUp a new user
router.post('/signup',validateUserSignUp,UserController.signUp)

//SignIn a new user
router.post('/signin',validateUserSignIn,passportLocal,UserController.signIn)

//Get login Status 
router.get('/status',passportJWT,UserController.status)

//SignOut a  user
router.get('/signout',passportJWT,UserController.signOut)


//User Profile
router.get('/user-profile/:username',UserController.profile)

//Google Oauth
router.post('/oauth/google',passportGoogle,UserController.googleAuth)

//Get my profile
router.get('/myprofile',passportJWT,UserController.getFullprofileInfo)

//Facebook OAuth
router.post('/oauth/facebook',passportFacebook,UserController.facebookOAuth)

module.exports = router