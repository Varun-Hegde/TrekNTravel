import React, { useEffect, useRef, useState } from 'react';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getTagCampgroundsAction } from '../actions/tagActions';
import Message from '../components/Message';
import { Row, Col } from 'react-bootstrap';
import Fade from 'react-reveal/Fade';
import Place from '../components/Place';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import getUserInfo from '../utils/getUserInfo';
import MessageNotificationModal from '../components/ModalPopUp';
import newMsgReceived from '../utils/newMsgSound';
import Notification from '../components/NotificationAlert';
const TagCampgrounds = ({ history, match }) => {
	const dispatch = useDispatch();

	const tagCampgrounds = useSelector((state) => state.getTagCampgrounds);
	const { loading, error, places } = tagCampgrounds;

	useEffect(() => {
		dispatch(getTagCampgroundsAction(match.params.tagname));
	}, [dispatch, match.params.tagname]);

	const userStatus = useSelector((state) => state.status);
	const { userInfo } = userStatus;

	const socket = useRef();
	const [newMessageReceived, setNewMessageReceived] = useState();
	const [newMessageModal, showNewMessageModal] = useState(false);

	const [newNotification, setNewNotification] = useState(null);
	const [notificationPopUp, setNotificationPopUp] = useState(false);
	const [open, setOpen] = useState(false);

	const [newNotificationComment, setNewNotificationComment] = useState(null);
	const [notificationCommentPopUp, setNotificationCommentPopup] = useState(false);

	const [newNotificationFollower, setNewNotificationFollower] = useState(null);
	const [notificationFollowerPopUp, setNotificationFollowerPopup] = useState(false);

	//SOCKETS
	useEffect(() => {
		if (userInfo && userInfo.user) {
			if (!socket.current) {
				socket.current = io('http://localhost:5000');
			}
			if (socket.current) {
				socket.current.emit('join', { userId: userInfo.user._id });

				socket.current.on('newMsgReceived', async ({ newMsg }) => {
					const { name, profilePic } = await getUserInfo(newMsg.sender);

					if (userInfo.user.newMessagePopUp) {
						setNewMessageReceived({
							...newMsg,
							senderName: name,
							senderProfilePic: profilePic,
						});
						showNewMessageModal(true);
					}
					newMsgReceived(name);
				});

				socket.current.on('newNotificationReceived', ({ username, profilePic, postId }) => {
					setNewNotification({ username, profilePic, postId });

					setNotificationPopUp(true);
					setOpen(true);
				});

				//COMMENT NOTIFICATION
				socket.current.on('newCommentNotificationReceived', ({ username, postId }) => {
					console.log('receiver event ');
					setNewNotificationComment({ username, postId });
					setNotificationCommentPopup(true);
					setOpen(true);
				});

				//FOLLOWER NOTIFICATION
				socket.current.on('newFollowerNotificationReceived', ({ username }) => {
					setNewNotificationFollower({ username });
					setNotificationFollowerPopup(true);
					setOpen(true);
				});
			}

			return () => {
				if (socket.current) {
					socket.current.emit('disconnect');
					socket.current.off(); //removes the event listener
				}
			};
		}
	}, [userInfo]);

	return (
		<>
			{notificationPopUp && newNotification != null && (
				<Notification
					open={open}
					setOpen={setOpen}
					newNotification={newNotification}
					notificationPopUp={notificationPopUp}
					showNotificationPopUp={setNotificationPopUp}
					msg={`${newNotification.username} liked your post`}
				/>
			)}

			{notificationFollowerPopUp && newNotificationFollower != null && (
				<Notification
					open={open}
					setOpen={setOpen}
					newNotification={newNotificationFollower}
					notificationPopUp={notificationFollowerPopUp}
					showNotificationPopUp={setNotificationFollowerPopup}
					msg={`${newNotificationFollower.username} started following you`}
				/>
			)}

			{notificationCommentPopUp && newNotificationComment != null && (
				<Notification
					open={open}
					setOpen={setOpen}
					newNotification={newNotificationComment}
					notificationPopUp={notificationCommentPopUp}
					showNotificationPopUp={setNotificationCommentPopup}
					msg={`${newNotificationComment.username} commented on your post`}
				/>
			)}

			{newMessageModal && newMessageReceived !== null && (
				<MessageNotificationModal
					socket={socket}
					showNewMessageModal={showNewMessageModal}
					newMessageModal={newMessageModal}
					newMessageReceived={newMessageReceived}
					user={userInfo.user}
				/>
			)}
			<Link className="btn btn-light my-3" to="/campgrounds">
				Go Back
			</Link>
			{loading && <Loader />}
			{error && <Message variant="danger">{error}</Message>}

			{places && places[0].places && places[0].places.length > 0 ? (
				<Row>
					{places[0].places.length > 0 ? (
						places[0].places.map((place) => (
							<div key={place._id}>
								<Col sm={12}>
									<Fade bottom>
										<Place place={place} history={history} />
									</Fade>
								</Col>
							</div>
						))
					) : !loading ? (
						<Message variant="info">No places found with this tag :( </Message>
					) : null}
				</Row>
			) : (
				<p>
					<Message variant="info">No places found with this tag :( </Message>
				</p>
			)}
		</>
	);
};

export default TagCampgrounds;
