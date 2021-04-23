import React from 'react';
import './SidebarChat.css';
import { Image } from 'react-bootstrap';
import moment from 'moment';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const SidebarChat = ({ data, connectedUsers, history }) => {
	const getQueryParams = () => {
		const params = new URLSearchParams(window.location.search);
		if (params.get('message'))
			return params.get('message').toString() === data.messagesWith && window.location.pathname === '/chats';
		return false;
	};

	const isOnline =
		connectedUsers.length > 0 && connectedUsers.filter((user) => user.userId === data.messagesWith).length > 0;

	return (
		<div
			onClick={() => history.push(`/chats?message=${data.messagesWith}`)}
			className={`chat__detail ${getQueryParams() && 'activeChat'}`}
		>
			<div className="sidebar_chat">
				{data.profilePic ? (
					<Image height="50" width="50" src={data.profilePic} roundedCircle />
				) : (
					<Image
						height="50"
						width="50"
						src={`https://avatars.dicebear.com/4.5/api/bottts/${data.messagesWith}.svg`}
						roundedCircle
					/>
				)}
				<div className="sidebarChat__info ml-4">
					<div className="sidebarChatHeader">
						<div className="d-flex justify-content-between">
							<p style={{ fontSize: '18px', fontWeight: 800 }}>{data.name}</p>
							{isOnline && <FiberManualRecordIcon style={{ color: '81b214', fontSize: '15px' }} />}
						</div>
					</div>
					<div style={{ fontSize: '14px' }} className=" d-flex justify-content-between">
						{data.lastMessage.length > 15 ? data.lastMessage.substring(0, 15) + ' ...' : data.lastMessage}

						<p className="ml-5"> {moment(data.date, 'YYYYMMDD').fromNow()}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SidebarChat;
