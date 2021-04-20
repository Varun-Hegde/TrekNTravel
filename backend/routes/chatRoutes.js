const express = require('express');
const router = express.Router();

const passport = require('passport');
const ChatController = require('../controllers/chatController');

const passportJWT = passport.authenticate('jwt', { session: false });

router.get('/', passportJWT, ChatController.getAllChats);
router.get('/user/:userToFindId', passportJWT, ChatController.getUserChat);

module.exports = router;
