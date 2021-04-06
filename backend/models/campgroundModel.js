const mongoose = require('mongoose');
const reviewModel = require('./reviewModel');
const Schema = mongoose.Schema;
const tagModel = require('./tagModel');
const CampgroundSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		geometry: {
			type: {
				type: String,
				enum: ['Point'],
			},
			coordinates: {
				type: [Number],
			},
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		description: {
			type: String,
			default: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
            culpa qui officia deserunt mollit anim id est laborum.`,
		},
		location: {
			type: String,
			required: true,
		},
		image: {
			type: [String],
			required: true,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		rating: {
			type: Number,
			default: 0,
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Review',
			},
		],
		numReviews: {
			type: Number,
			default: 0,
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
	},
	{
		timestamps: true,
	}
);

CampgroundSchema.post('findOneAndDelete', async (campground) => {
	if (campground) {
		await reviewModel.deleteMany({ _id: { $in: campground.reviews } });
	}
});

CampgroundSchema.post('findOneAndDelete', async (campground) => {
	if (campground) {
		for (let id of campground.tags) {
			//let tag = await tagModel.findById(id);
			await tagModel.findByIdAndUpdate(id, { $pull: { places: { $in: [campground._id] } } });
		}
	}
});

module.exports = mongoose.model('Campground', CampgroundSchema);
