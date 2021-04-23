import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import Place from '../components/Place';
import { listPlaces, listMyFeed } from '../actions/campgroundActions';
import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { listTags } from '../actions/tagActions';
import { BulletList } from 'react-content-loader';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import { LinkContainer } from 'react-router-bootstrap';
import { List } from 'react-content-loader';
import io from 'socket.io-client';
import getUserInfo from '../utils/getUserInfo';
import MessageNotificationModal from '../components/ModalPopUp';
import newMsgReceived from '../utils/newMsgSound';
import Notification from '../components/NotificationAlert';
const HomeScreen = ({ history, match }) => {
	const dispatch = useDispatch();

	const [feed, setFeed] = useState('globalfeed');

	const placeList = useSelector((state) => state.placeList);
	const { loading: allLoading, error: allError, places: allPlaces, page: allPage, pages: allPages } = placeList;

	const placeMyFeedList = useSelector((state) => state.placeMyFeedList);
	const { loading, error, places, page, pages } = placeMyFeedList;

	const userStatus = useSelector((state) => state.status);
	const { isLoggedIn, userInfo } = userStatus;

	const allTags = useSelector((state) => state.getTags);
	const { loading: loadingTags, tags, error: errorTags } = allTags;

	const pageNumber = match.params.pageNumber ? match.params.pageNumber : '1';

	const socket = useRef();
	const [newMessageReceived, setNewMessageReceived] = useState();
	const [newMessageModal, showNewMessageModal] = useState(false);

	const [newNotification, setNewNotification] = useState(null);
	const [notificationPopUp, setNotificationPopUp] = useState(false);
	const [open, setOpen] = useState(false);

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
			}

			return () => {
				if (socket.current) {
					socket.current.emit('disconnect');
					socket.current.off(); //removes the event listener
				}
			};
		}
	}, [userInfo]);

	useEffect(() => {
		if (!isLoggedIn) {
			dispatch(listPlaces(pageNumber));
		} else {
			if (feed === 'globalfeed') dispatch(listPlaces(pageNumber));
			if (feed === 'myfeed') dispatch(listMyFeed(pageNumber));
		}

		window.scrollTo(0, 0);
	}, [dispatch, pageNumber, match, feed, isLoggedIn]);

	useEffect(() => {
		dispatch(listTags());
	}, [dispatch]);

	return (
		<>
			{notificationPopUp && newNotification != null && (
				<Notification
					open={open}
					setOpen={setOpen}
					newNotification={newNotification}
					notificationPopUp={notificationPopUp}
					showNotificationPopUp={setNotificationPopUp}
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

			<div>
				{process.env.REACT_APP_TITLE}
				{isLoggedIn && (
					<Button
						onClick={() => setFeed('myfeed')}
						active={feed === 'myfeed'}
						className="btn btn-light mb-3 "
					>
						Your Feed
					</Button>
				)}

				<Button
					onClick={() => setFeed('globalfeed')}
					active={feed === 'globalfeed'}
					className="btn btn-light ml-3 mb-3"
				>
					Global Feed
				</Button>
			</div>

			<Row>
				<Col sm={12} md={9}>
					{feed === 'globalfeed' ? (
						<>
							{allLoading ? (
								<List />
							) : allError ? (
								<Message variant="danger">{error}</Message>
							) : (
								<>
									<Row>
										{allPlaces.length > 0 ? (
											allPlaces.map((place) => (
												<>
													<Col key={place._id} sm={12}>
														<Fade bottom>
															<Place place={place} history={history} />
														</Fade>
													</Col>
												</>
											))
										) : (
											<Message variant="info">No places found. </Message>
										)}
									</Row>
									<Fade bottom>
										<Row>
											<Col sm={12} className="d-flex justify-content-center">
												<Paginate pages={allPages} page={allPage} />
											</Col>
										</Row>
									</Fade>
								</>
							)}
						</>
					) : (
						<>
							{loading ? (
								<List />
							) : error ? (
								<Message variant="danger">You must be signed in to view your feed</Message>
							) : (
								<>
									<Row>
										{places.length > 0 ? (
											places.map((place) => (
												<Col key={place._id} sm={12}>
													<Fade bottom>
														<Place place={place} history={history} />
													</Fade>
												</Col>
											))
										) : (
											<Message variant="info">No posts from people you follow </Message>
										)}
									</Row>
									<Fade bottom>
										<Row>
											<Col sm={12} className="d-flex justify-content-center">
												<Paginate pages={pages} page={page} />
											</Col>
										</Row>
									</Fade>
								</>
							)}
						</>
					)}
				</Col>
				<Col className="tags" sm={12} md={3}>
					<p style={{ fontSize: '25px' }}>Popular Tags</p>
					{loadingTags ? <BulletList /> : null}
					{tags && tags.length > 0
						? tags.map((tag) => {
								return (
									<LinkContainer to={`/tags/${tag.tag}`}>
										<Chip
											className="m-1"
											avatar={<Avatar>{tag.tag[0]}</Avatar>}
											label={tag.tag}
											component="a"
											clickable
										/>
									</LinkContainer>
								);
						  })
						: null}
				</Col>
			</Row>
		</>
	);
};

export default HomeScreen;
