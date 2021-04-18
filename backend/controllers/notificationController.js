const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');

module.exports.getNotifications = asyncHandler(async (req, res, next) => {
	const allNotifications = await Notification.findOne({ user: req.user._id })
		.populate('notifications.user', 'username')
		.populate('notifications.post', 'title');
	res.status(200).json(allNotifications);
});
