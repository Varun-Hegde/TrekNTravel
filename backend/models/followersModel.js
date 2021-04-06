const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema(
	{
		follower: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		following: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Follow', followerSchema);
