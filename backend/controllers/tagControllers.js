const asyncHandler = require('express-async-handler');
const Tag = require('../models/tagModel');

module.exports.getTags = asyncHandler(async (req, res) => {
	const keyword = req.query.keyword
		? {
				tag: {
					$regex: req.query.keyword,
					$options: 'i',
				},
		  }
		: {};

	const tags = await Tag.find({ ...keyword }, 'tag').sort({ tag: 'asc' });
	res.json(tags);
});

module.exports.getCampgrounds = asyncHandler(async (req, res) => {
	const keyword = req.query.tag
		? {
				tag: {
					$regex: req.query.tag,
					$options: 'i',
				},
		  }
		: {};

	const campgrounds = await Tag.find({ ...keyword }).populate('places');

	res.json(campgrounds);
});
