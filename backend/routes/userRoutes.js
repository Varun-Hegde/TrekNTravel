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


router.post('/signup',validateUserSignUp,UserController.signUp)                                 //SignUp a new user
router.post('/signin',validateUserSignIn,passportLocal,UserController.signIn)                   //SignIn a new user
router.get('/status',passportJWT,UserController.status)                                         //Get login Status 
router.get('/signout',passportJWT,UserController.signOut)                                       //SignOut a  user
router.get('/user-profile/:username',UserController.profile)                                    //User Profile
router.post('/oauth/google',passportGoogle,UserController.googleAuth)                           //Google Oauth
router.get('/myprofile',passportJWT,UserController.getFullprofileInfo)                          //Get my profile
router.post('/oauth/facebook',passportFacebook,UserController.facebookOAuth)                    //Facebook OAuth
router.post('/oauth/link/google',passportJWT,passportGoogle,UserController.linkGoogle)          //Link google
router.post('/oauth/link/facebook',passportJWT,passportFacebook,UserController.linkFacebook)    //Link facebook
router.post('/oauth/unlink/google',passportJWT,UserController.unLinkGoogle)                     //UnLink google
router.post('/oauth/unlink/facebook',passportJWT,UserController.unLinkFacebook)                 //UnLink facebook

module.exports = router