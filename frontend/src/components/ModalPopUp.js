import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import moment from 'moment';
import './ModalPopUp.css';
import { Avatar } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
const ModalPopUp = ({ socket, showNewMessageModal, user, newMessageReceived, newMessageModal }) => {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [showIcon, setShowIcon] = useState(false);
	const [msgText, setMsgText] = useState('');

	useEffect(() => {
		if (msgText.length > 0) setShowIcon(true);
		else setShowIcon(false);
	}, [msgText]);

	const submitHandler = (e) => {
		e.preventDefault();
		if (socket.current) {
			socket.current.emit('sendMsgFromNotification', {
				userId: user._id,
				msgSendToUserId: newMessageReceived.sender,
				msg: msgText,
			});

			socket.current.on('msgSentFromNotification', () => {
				showNewMessageModal(false);
			});
		}
	};
	console.log(newMessageReceived);
	return (
		<div style={{ padding: '15px' }}>
			<Button size="sm" variant="outline-info" onClick={handleShow}>
				New message from {newMessageReceived.senderName}
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>New message from {newMessageReceived.senderName}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<>
						<div style={{ display: 'flex' }}>
							<Avatar
								src={
									newMessageReceived.senderProfilePic
										? newMessageReceived.senderProfilePic
										: `https://avatars.dicebear.com/4.5/api/bottts/${newMessageReceived.senderName}.svg`
								}
							/>
							<p className={`chat__message `}>
								{newMessageReceived.msg}
								<span className="chat__time">{moment(newMessageReceived.date).format('llll')}</span>
							</p>
						</div>

						<div className="chat__footer">
							<form onSubmit={submitHandler}>
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
					</>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default ModalPopUp;
