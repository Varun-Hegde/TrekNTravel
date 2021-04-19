const ChatModel = require('../models/chatModel');
const asyncHandler = require('express-async-handler');

module.exports.getAllChats = asyncHandler(async (req, res, next) => {
	const userId = req.user._id;
	const user = await ChatModel.findOne({ user: userId }).populate('chats.messagesWith');

	let chatsToBeSent = [];

	if (user.chats.length > 0) {
		chatsToBeSent = await user.chats.map((chat) => {
			return {
				messagesWith: chat.messagesWith._id,
				name: chat.messagesWith.username,
				profilePicUrl: chat.messagesWith.profilePic,
				lastMessage: chat.messages[chat.messages.length - 1].msg,
				date: chat.messages[chat.messages.length - 1].date,
			};
		});
	}
	res.json(chatsToBeSent);
});
