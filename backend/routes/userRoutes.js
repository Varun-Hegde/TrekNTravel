const express = require('express')
const router = express.Router()
const passport = require('passport')
const passportConf = require('../passport')
const {validateUser} = require('../validations/userValidations')
const UserController = require('../controllers/userControllers')

const passportLocal = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

//   @desc   SignUp a new user
//   @route  POST api/users/signup
//   @access Public
router.post('/signup',validateUser,UserController.signUp)

//   @desc   SignUp a new user
//   @route  POST api/users/signup
//   @access Public
router.post('/signin',validateUser,passportLocal,UserController.signIn)

//   @desc   Get login Status 
//   @route  GET api/users/status
//   @access Private
router.get('/status',passportJWT,UserController.status)

//   @desc   SignOut a  user
//   @route  GET api/users/signout
//   @access Private
router.get('/signout',passportJWT,UserController.signOut)


module.exports = router