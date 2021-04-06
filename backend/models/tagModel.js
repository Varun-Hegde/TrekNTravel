const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema(
	{
		tag: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		places: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Campground',
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Tag', tagSchema);
