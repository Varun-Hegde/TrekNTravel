import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import getUserInfo from '../utils/getUserInfo';
import ChatSidebar from '../components/ChatSidebar';
import { Button } from 'react-bootstrap';
import SendIcon from '@material-ui/icons/Send';
import { Avatar, IconButton } from '@material-ui/core';
import { Message } from '@material-ui/icons';
import { LinkContainer } from 'react-router-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import './Chats.css';
import newMsgReceived from '../utils/newMsgSound';
import moment from 'moment';

const scrollDivToBottom = (divRef) => divRef.current !== null && divRef.current.scrollIntoView({ behaviour: 'smooth' });

const ChatScreen = ({ history, location }) => {
	const [chats, setChats] = useState({});
	const [chatsErr, setChatsErr] = useState('');

	const [user, setUser] = useState({});
	const [userErr, setUserErr] = useState('');
	const [msgText, setMsgText] = useState('');
	const [showIcon, setShowIcon] = useState(false);

	const divRef = useRef();

	useEffect(() => {
		const getChats = async () => {
			try {
				const { data } = await axios.get('/api/chats');
				setChats(data);
			} catch (e) {
				setChatsErr(e);
			}
		};

		const getUser = async () => {
			try {
				const { data } = await axios.get('/api/users/status');
				setUser(data);
			} catch (e) {
				setUserErr(e);
				setUser({ loggedIn: false, user: null });
			}
		};

		getChats();
		getUser();
	}, []);

	useEffect(() => {
		if (user.loggedIn === false || userErr) {
			history.push('/campgrounds');
		}
	}, [user, history, userErr]);

	const socket = useRef();

	const [connectedUsers, setConnectedUsers] = useState([]);

	const [messages, setMessages] = useState([]);
	const [bannerData, setBannerData] = useState({ name: '', profilePicUrl: '' });

	//This is for persisting the state of query string in url through out re-renders
	//This refers to the query string in url
	const openChatId = useRef();

	const queryMsg = location.search ? location.search.split('=')[1] : '';
	//CONNECTION useEffect
	useEffect(() => {
		if (user.loggedIn) {
			if (!socket.current) {
				socket.current = io('http://localhost:5000');
			}

			if (socket.current) {
				socket.current.emit('join', { userId: user.user._id });

				socket.current.on('connectedUsers', ({ users }) => {
					users.length > 0 && setConnectedUsers(users);
				});
			}

			return () => {
				if (socket.current) {
					socket.current.emit('disconnect');
					socket.current.off(); //removes the event listener
				}
			};
		}
	}, [user]);

	//GET PREVIOUS MESSAGES FOR CHAT WITH A PARTICULAR USER
	useEffect(() => {
		if (user.loggedIn) {
			const loadMessages = () => {
				socket.current.emit('loadMessages', {
					userId: user.user._id,
					messagesWith: queryMsg,
				});

				socket.current.on('messagesLoaded', ({ chat }) => {
					setMessages(chat.messages);
					setBannerData({
						name: chat.messagesWith.username,
						profilePic: chat.messagesWith.profilePic,
					});
					openChatId.current = chat.messagesWith._id;
					divRef.current && scrollDivToBottom(divRef);
				});

				socket.current.on('noChatFound', async () => {
					const { name, profilePic } = await getUserInfo(queryMsg);
					setBannerData({ name, profilePic });

					setMessages([]);
					openChatId.current = queryMsg;
				});
			};

			if (socket.current && queryMsg) loadMessages();
		}
	}, [queryMsg, user]);

	const sendMsg = (msg) => {
		if (user.loggedIn) {
			if (socket.current) {
				socket.current.emit('sendNewMsg', {
					userId: user.user._id,
					msgSendToUserId: openChatId.current,
					msg,
				});
			}
		}
	};

	//Confirming msg sent and receiving msg
	useEffect(() => {
		if (user.loggedIn) {
			if (socket.current) {
				socket.current.on('msgSent', ({ newMsg }) => {
					if (newMsg.receiver.toString() === openChatId.current.toString()) {
						setMessages((prev) => [...prev, newMsg]);

						//Update sidebar msg to recent msg
						setChats((prev) => {
							const previousChat = prev.find((chat) => chat.messagesWith === newMsg.receiver);
							previousChat.lastMessage = newMsg.msg;
							previousChat.date = newMsg.date;

							return [...prev];
						});
					}
				});
				socket.current.on('newMsgReceived', async ({ newMsg }) => {
					let senderName;
					//When chat is opened inside your browser
					if (newMsg.sender === openChatId.current) {
						setMessages((prev) => [...prev, newMsg]);

						//Update sidebar msg to recent msg
						setChats((prev) => {
							console.log(prev);
							const previousChat = prev.find((chat) => chat.messagesWith === newMsg.sender);
							previousChat.lastMessage = newMsg.msg;
							previousChat.date = newMsg.date;

							senderName = previousChat.name;

							return [...prev];
						});
					} else {
						const ifPrevMessaged = chats.filter((chat) => chat.messagesWith === newMsg.sender).length > 0;

						if (ifPrevMessaged) {
							setChats((prev) => {
								const previousChat = prev.find((chat) => chat.messagesWith === newMsg.sender);
								previousChat.lastMessage = newMsg.msg;
								previousChat.date = newMsg.date;

								senderName = previousChat.name;

								return [previousChat, ...prev.filter((chat) => chat.messagesWith !== newMsg.sender)];
							});
						}
						//IF NO PREVIOUS CHAT WITH THE SENDER
						else {
							const { name, profilePic } = await getUserInfo(newMsg.sender);
							senderName = name;
							const newChat = {
								messagesWith: newMsg.sender,
								name,
								profilePic,
								lastMessage: newMsg.msg,
								date: newMsg.date,
							};
							setChats((prev) => [newChat, ...prev]);
						}
					}
					newMsgReceived(senderName);
				});
			}
		}
	}, [user]);

	useEffect(() => {
		messages.length > 0 && scrollDivToBottom(divRef);
	}, [messages]);

	useEffect(() => {
		if (msgText.length > 0) setShowIcon(true);
		else setShowIcon(false);
	}, [msgText]);

	const submitHandler = (e) => {
		e.preventDefault();
		sendMsg(msgText);
		setMsgText('');
	};

	return (
		<div className="app">
			<div className="app__body">
				<ChatSidebar
					connectedUsers={connectedUsers}
					chats={chats}
					setChats={setChats}
					history={history}
					user={user}
				/>
				<div className="chat">
					<div className="chat__header">
						{bannerData ? (
							<>
								{bannerData.profilePic ? (
									<Avatar style={{ fontSize: '20px' }} src={bannerData.profilePic} />
								) : (
									<Avatar
										src={`https://avatars.dicebear.com/4.5/api/bottts/${bannerData.name}.svg`}
									/>
								)}
								<div className="chat__headerInfo">
									<LinkContainer
										style={{ cursor: 'pointer' }}
										to={`/user-profile/${bannerData.name}`}
									>
										<h4>{bannerData.name}</h4>
									</LinkContainer>
								</div>
							</>
						) : null}
					</div>

					<div className="chat__body">
						<Scrollbars>
							{messages && messages.length > 0
								? messages.map((msg) => {
										const isSender = user && user.user._id.toString() === msg.sender.toString();
										return (
											<>
												<p
													ref={divRef}
													className={`chat__message ${isSender && 'chat__receiver'}`}
												>
													{msg.msg}
													<span className="chat__time">
														{moment(msg.date).format('llll')}
													</span>
												</p>
											</>
										);
								  })
								: null}
						</Scrollbars>
					</div>

					<div className="chat__footer">
						<form onSubmit={(e) => submitHandler(e)}>
							<input
								placeholder="Type a message"
								type="text"
								value={msgText}
								onChange={(e) => setMsgText(e.target.value)}
							/>
							{showIcon ? (
								<Button type="submit" variant="outline-link" size="sm">
									<SendIcon style={{ color: 'black', alignSelf: 'center' }} />
								</Button>
							) : null}
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatScreen;
