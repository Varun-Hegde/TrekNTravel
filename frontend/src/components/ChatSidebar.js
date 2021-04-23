import React, { useState } from 'react';
import axios from 'axios';
import { Avatar } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';

import './ChatSidebar.css';
import SidebarChat from './SidebarChat';
import { Scrollbars } from 'react-custom-scrollbars';
import { Image } from 'react-bootstrap';

const ChatSidebar = ({ history, chats, setChats, user, connectedUsers }) => {
	let cancelToken;

	//const [searchText, setSearchText] = useState([]);
	const [searchData, setSearchData] = useState('');

	const addMessage = (data) => {
		/* const alreadyInChat =
			searchData && searchData.length > 0 && searchData.filter((sd) => sd.messagesWith === data._id);
 */
		const alreadyInChat = chats && chats.length > 0 && chats.filter((chat) => chat.messagesWith === data._id);
		if (alreadyInChat.length > 0) {
			history.push(`/chats?message=${data._id}`);
		} else {
			let date = new Date();
			date = date.toISOString();
			const newMsg = {
				messagesWith: data._id,
				name: data.username,
				profilePic: data.profilePic,
				lastMessage: '',
				date,
			};

			setChats((prev) => [newMsg, ...prev]);
			history.push(`/chats?message=${data._id}`);
		}
	};

	const onType = async (e) => {
		const search = e.target.value;
		if (!search) setSearchData('');
		setSearchData('');

		if (typeof cancelToken != typeof undefined) {
			cancelToken.cancel('Cancelling the previous request');
		}

		cancelToken = axios.CancelToken.source();
		const result = await axios.get(`/api/search-user?keyword=${search}`, { cancelToken: cancelToken.token });

		if (result.data) {
			setSearchData(result.data);
		}
	};

	return (
		<div className="sidebar">
			<div className="sidebar__header">
				{user.loggedIn ? (
					user && user.user.profilePic ? (
						<Avatar style={{ fontSize: '20px' }} src={user.user.profilePic} />
					) : (
						<Avatar src={`https://avatars.dicebear.com/4.5/api/bottts/${user.user._id}.svg`} />
					)
				) : null}
				<h4>{user.loggedIn && user.user.username}</h4>
			</div>

			<div className="sidebar__search">
				<div className="sidebar__searchContainer">
					<SearchOutlined />
					<input onChange={onType} placeholder="Search or start new chat" type="text" />
				</div>
				<div className="sidebar__searchResults">
					{searchData && searchData.length > 0
						? searchData.map((data) => {
								return (
									<div onClick={() => addMessage(data)} className="search__display">
										{data.profilePic ? (
											<Image height="50" width="50" src={data.profilePic} roundedCircle />
										) : (
											<Image
												height="50"
												width="50"
												src={`https://avatars.dicebear.com/4.5/api/bottts/${data._id}.svg`}
												roundedCircle
											/>
										)}
										<p className="ml-2 align-self-center pt-3">{data.username}</p>{' '}
									</div>
								);
						  })
						: null}
				</div>
			</div>

			<div className="sidebar__chats">
				<Scrollbars>
					{chats && chats.length > 0
						? chats.map((chat) => {
								return <SidebarChat connectedUsers={connectedUsers} history={history} data={chat} />;
						  })
						: null}
				</Scrollbars>
			</div>
		</div>
	);
};

export default ChatSidebar;
