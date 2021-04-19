const express = require('express');
const router = express.Router();

const passport = require('passport');
const ChatController = require('../controllers/chatController');

const passportJWT = passport.authenticate('jwt', { session: false });

router.get('/', passportJWT, ChatController.getAllChats);

module.exports = router;
