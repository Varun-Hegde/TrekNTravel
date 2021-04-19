import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, IconButton } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import './ChatSidebar.css';
import SidebarChat from './SidebarChat';
import { Scrollbars } from 'react-custom-scrollbars';
import { Image } from 'react-bootstrap';
import { allChats } from '../actions/chatActions';
import { ALL_CHATS_SUCCESS } from '../constants/chatConstants';

const ChatSidebar = ({ history }) => {
	let cancelToken;

	const dispatch = useDispatch();

	const [searchText, setSearchText] = useState([]);
	const [searchData, setSearchData] = useState('');

	const userStatus = useSelector((state) => state.status);
	const { isLoggedIn, userInfo } = userStatus;

	const allChatsReducer = useSelector((state) => state.allChats);
	let { loading, chats, error } = allChatsReducer;

	const addMessage = (data) => {
		const alreadyInChat =
			searchData && searchData.length > 0 && searchData.filter((sd) => sd.messagesWith === data._id);

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
			console.log('IM HERE');
			dispatch({
				type: ALL_CHATS_SUCCESS,
				payload: [newMsg, ...chats],
			});
			history.push(`/chats?message=${data._id}`);
		}
	};

	useEffect(() => {
		dispatch(allChats());
	}, [dispatch]);

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
				{userInfo ? (
					userInfo && userInfo.user.profilePic ? (
						<Avatar style={{ fontSize: '20px' }} src={userInfo.user.profilePic} />
					) : (
						<Avatar src={`https://avatars.dicebear.com/4.5/api/bottts/${userInfo.user._id}.svg`} />
					)
				) : null}
				<h4>{userInfo && userInfo.user.username}</h4>
			</div>

			<div className="sidebar__search">
				<div className="sidebar__searchContainer">
					<SearchOutlined />
					<input onChange={onType} placeholder="Search or start new chat" type="text" />
				</div>
				<div className="sidebar__searchResults">
					{searchData && searchData.length > 0 ? (
						searchData.map((data) => {
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
					) : (
						<p className="m-2">No user found with this username :(</p>
					)}
				</div>
			</div>

			<div className="sidebar__chats">
				<Scrollbars>
					{chats && chats.length > 0
						? chats.map((chat) => {
								return <SidebarChat data={chat} />;
						  })
						: null}
				</Scrollbars>
			</div>
		</div>
	);
};

export default ChatSidebar;
