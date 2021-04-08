const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const Campground = require('../models/campgroundModel');
const User = require('../models/userModel');

router.get(
	'/search',
	asyncHandler(async (req, res) => {
		if (!req.query.keyword || req.query.keyword.length < 1) {
			res.status(404);
			throw new Error('Keyword to search not found');
		}

		const keyword1 = req.query.keyword
			? {
					username: {
						$regex: req.query.keyword,
						$options: 'i',
					},
			  }
			: {};

		const keyword2 = req.query.keyword
			? {
					title: {
						$regex: req.query.keyword,
						$options: 'i',
					},
			  }
			: {};

		const campground = await Campground.find({ ...keyword2 });
		const user = await User.find({ ...keyword1 });

		res.json({ campground, user });
	})
);

module.exports = router;
