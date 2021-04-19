import React, { useState, useEffect } from 'react';
import './Chats.css';
import Sidebar from '../components/ChatSidebar';
import { useSelector, useDispatch } from 'react-redux';

const ChatScreen = ({ history }) => {
	const dispatch = useDispatch();
	const userStatus = useSelector((state) => state.status);
	const { isLoggedIn, userInfo } = userStatus;

	return (
		<div className="app">
			<div className="app__body">
				<Sidebar history={history} />
				{/* CHATS*/}
			</div>
		</div>
	);
};

export default ChatScreen;
