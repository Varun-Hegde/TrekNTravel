const express = require('express')
const router = express.Router()
const passport = require('passport')
const passportConf = require('../passport')
const {validateUserSignIn,validateUserSignUp} = require('../validations/userValidations')
const UserController = require('../controllers/userControllers')

const passportLocal = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken',{session: false})

//   @desc   SignUp a new user
router.post('/signup',validateUserSignUp,UserController.signUp)

//   @desc   SignUp a new user
router.post('/signin',validateUserSignIn,passportLocal,UserController.signIn)

//   @desc   Get login Status 
router.get('/status',passportJWT,UserController.status)

//   @desc   SignOut a  user
router.get('/signout',passportJWT,UserController.signOut)


//   @desc   User Profile
router.get('/user-profile/:username',UserController.profile)

//  @desc   Google Oauth
router.post('/oauth/google',passportGoogle,UserController.googleAuth)

router.get('/myprofile',passportJWT,UserController.getFullprofileInfo)


module.exports = router