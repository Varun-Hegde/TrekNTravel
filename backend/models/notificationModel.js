const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},

	notifications: [
		{
			//notification type
			type: {
				type: String,
				enum: ['newLike', 'newComment', 'newFollower', 'newPost'],
			},

			//User from whom notification is
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},

			//Post on which new comment/like is added
			post: {
				type: Schema.Types.ObjectId,
				ref: 'Campground',
			},

			//id of the comment if notification is related to comments/reviews
			commentId: {
				type: Schema.Types.ObjectId,
				ref: 'Review',
			},

			//Text for notification, to show to user
			text: {
				type: String,
			},

			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
});

module.exports = mongoose.model('Notification', NotificationSchema);
