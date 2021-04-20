const ChatModel = require('../models/chatModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const loadMessages = asyncHandler(async (userId, messagesWith) => {
	const user = await ChatModel.findOne({ user: userId }).populate('chats.messagesWith').select('-local -methods');

	const chat = user.chats.find((chat) => chat.messagesWith._id.toString() === messagesWith);

	if (!chat) {
		return {
			error: 'No chat found',
		};
	}
	return { chat };
});

const sendMsg = asyncHandler(async (userId, msgSendToUserId, msg) => {
	//logged in user(sender)
	const user = await ChatModel.findOne({ user: userId });
	//receiver
	const msgSendToUser = await ChatModel.findOne({ user: msgSendToUserId });

	const newMsg = {
		sender: userId,
		receiver: msgSendToUserId,
		msg,
		date: Date.now(),
	};

	//For Sender
	const previousChat = user.chats.find((chat) => chat.messagesWith.toString() === msgSendToUserId.toString());

	if (previousChat) {
		previousChat.messages.push(newMsg);
		await user.save();
	} else {
		const newChat = { messagesWith: msgSendToUserId, messages: [newMsg] };
		user.chats.unshift(newChat);
		await user.save();
	}

	//For Receiver
	const previousChatForReceiver = msgSendToUser.chats.find(
		(chat) => chat.messagesWith.toString() === userId.toString()
	);

	if (previousChatForReceiver) {
		previousChatForReceiver.messages.push(newMsg);
		await msgSendToUser.save();
	} else {
		const newChat = { messagesWith: userId, messages: [newMsg] };
		msgSendToUser.chats.unshift(newChat);
		await msgSendToUser.save();
	}

	return { newMsg };
});

const setMsgToUnread = asyncHandler(async (userId) => {
	const user = await User.findById(userId);
	if (!user.unreadMessage) {
		user.unreadMessage = true;
		await user.save();
	}
	return;
});

module.exports = { loadMessages, sendMsg, setMsgToUnread };
