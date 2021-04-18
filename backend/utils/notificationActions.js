const UserModel = require('../models/userModel');
const NotificationModel = require('../models/notificationModel');
const asyncHandler = require('express-async-handler');

const setNotificationToUnread = asyncHandler(async (userId) => {
	const user = await UserModel.findById(userId);

	if (!user.unreadNotification) {
		user.unreadNotification = true;
		await user.save();
	}

	return;
});

module.exports.newLikeNotification = asyncHandler(async (userId, postId, userToNotifyId) => {
	//userId => User from whom notification is
	//postId => Post associated with the notification
	//userToNotify => Which user to send notification to
	console.log('Inside newLike Notify');
	const userToNotify = await NotificationModel.findOne({ user: userToNotifyId });

	const newNotification = {
		type: 'newLike',
		user: userId,
		post: postId,
		date: Date.now(),
	};

	await userToNotify.notifications.unshift(newNotification);
	await userToNotify.save();

	await setNotificationToUnread(userToNotifyId);
	return;
});

module.exports.removeLikeNotification = asyncHandler(async (userId, postId, userToNotifyId) => {
	await NotificationModel.findOneAndUpdate(
		{ user: userToNotifyId },
		{
			$pull: {
				notifications: {
					type: 'newLike',
					user: userId,
					post: postId,
				},
			},
		}
	);

	return;
});

module.exports.newCommentNotification = asyncHandler(async (postId, commentId, userId, userToNotifyId, text) => {
	const userToNotify = await NotificationModel.findOne({ user: userToNotifyId });

	const newNotification = {
		type: 'newComment',
		user: userId,
		post: postId,
		commentId,
		text,
		date: Date.now(),
	};

	await userToNotify.notifications.unshift(newNotification);

	await userToNotify.save();

	await setNotificationToUnread(userToNotifyId);
	return;
});

module.exports.removeCommentNotification = asyncHandler(async (postId, commentId, userId, userToNotifyId) => {
	await NotificationModel.findOneAndUpdate(
		{ user: userToNotifyId },
		{
			$pull: {
				notifications: {
					type: 'newComment',
					user: userId,
					post: postId,
					commentId: commentId,
				},
			},
		}
	);

	return;
});

module.exports.newFollowerNotification = asyncHandler(async (userId, userToNotifyId) => {
	const user = await NotificationModel.findOne({ user: userToNotifyId });

	const newNotification = {
		type: 'newFollower',
		user: userId,
		date: Date.now(),
	};

	await user.notifications.unshift(newNotification);

	await user.save();

	await setNotificationToUnread(userToNotifyId);
	return;
});

module.exports.removeFollowerNotification = asyncHandler(async (userId, userToNotifyId) => {
	try {
		await NotificationModel.findOneAndUpdate(
			{ user: userToNotifyId },
			{ $pull: { notifications: { type: 'newFollower', user: userId } } }
		);

		return;
	} catch (error) {
		console.error(error);
	}
});
