import React from 'react';
import './SidebarChat.css';
import { Image } from 'react-bootstrap';
import moment from 'moment';
import { LinkContainer } from 'react-router-bootstrap';

const SidebarChat = ({ data }) => {
	const getQueryParams = () => {
		const params = new URLSearchParams(window.location.search);
		if (params.get('message'))
			return params.get('message').toString() === data.messagesWith && window.location.pathname === '/chats';
		return false;
	};

	return (
		<LinkContainer to={`/chats?message=${data.messagesWith}`}>
			<div className={`chat__detail ${getQueryParams() && 'activeChat'}`}>
				<div className={`d-flex `}>
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
					<p style={{ fontSize: '20px' }} className="ml-3 pt-3">
						{data.name}
					</p>
				</div>
				<div style={{ fontSize: '14px' }} className="ml-3 d-flex justify-content-between">
					{data.lastMessage}
					<p>{moment(data.date, 'YYYYMMDD').fromNow()}</p>
				</div>
				<hr />
			</div>
		</LinkContainer>
	);
};

export default SidebarChat;
