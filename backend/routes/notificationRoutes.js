const express = require('express');
const router = express.Router();
const passport = require('passport');
const Notification = require('../controllers/notificationController');

const passportJWT = passport.authenticate('jwt', { session: false });

router.get('/', passportJWT, Notification.getNotifications);

module.exports = router;
