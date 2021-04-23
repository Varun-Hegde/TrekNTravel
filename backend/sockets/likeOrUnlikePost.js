const User = require('../models/userModel');
const Post = require('../models/campgroundModel');
const asyncHandler = require('express-async-handler');

const { newLikeNotification, removeLikeNotification } = require('../utils/notificationActions');

const likeOrUnlikePost = asyncHandler(async (postId, userId, like) => {
	const post = await Post.findById(postId);
	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}
	console.log('LIKE :***** ', like);

	if (like) {
		let foundUserLike = post.likes.some((like) => like.toString() === userId.toString());

		if (foundUserLike) {
			return { error: 'Post liked before' };
		}

		await post.likes.unshift(userId);

		const newPost = await post.save();

		if (post.author.toString() !== userId) {
			await newLikeNotification(userId, postId, post.author.toString());
		}
	} else {
		let foundUserLike = post.likes.filter((like) => like.toString() === userId.toString()).length === 0;

		if (foundUserLike) {
			return { error: 'Post not liked before' };
		}

		await post.likes.pull(userId);

		const newPost = await post.save();

		if (post.author.toString() !== userId) {
			await removeLikeNotification(userId, postId, post.author.toString());
		}
	}

	const user = await User.findById(userId);
	const { username, profilePic } = user;

	return { success: true, username, profilePic, postByUserId: post.author.toString() };
});

module.exports = { likeOrUnlikePost };
