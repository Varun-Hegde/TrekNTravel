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
const TagCampgrounds = ({ history, match }) => {
	const dispatch = useDispatch();

	const tagCampgrounds = useSelector((state) => state.getTagCampgrounds);
	const { loading, error, places } = tagCampgrounds;

	useEffect(() => {
		dispatch(getTagCampgroundsAction(match.params.tagname));
	}, [dispatch, match.params.tagname]);

	const userStatus = useSelector((state) => state.status);
	const { isLoggedIn, userInfo } = userStatus;

	const socket = useRef();
	const [newMessageReceived, setNewMessageReceived] = useState();
	const [newMessageModal, showNewMessageModal] = useState(false);

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
							<>
								<Col key={place._id} sm={12}>
									<Fade bottom>
										<Place place={place} history={history} />
									</Fade>
								</Col>
							</>
						))
					) : !loading ? (
						<Message variant="info">No places found. </Message>
					) : null}
				</Row>
			) : (
				<p>No places found with this tag:(</p>
			)}
		</>
	);
};

export default TagCampgrounds;
