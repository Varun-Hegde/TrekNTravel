const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');

module.exports.getNotifications = asyncHandler(async (req, res, next) => {
	const allNotifications = await Notification.findOne({ user: req.user._id })
		.populate('notifications.user', 'username')
		.populate('notifications.post', 'title');

	let updatedNotifications = [];
	let i = 0;
	for (let notification of allNotifications.notifications) {
		updatedNotifications.push(notification);
		i++;
		if (i == 5) break;
	}
	allNotifications.notifications = updatedNotifications;
	res.status(200).json(allNotifications);
});
