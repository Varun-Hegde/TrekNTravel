import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profile } from '../actions/userActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Place from '../components/PlaceProfile';
import { Row, Col, Image, Nav, Button } from 'react-bootstrap';
import Fade from 'react-reveal/Fade';
import { Facebook } from 'react-content-loader';
import io from 'socket.io-client';
import getUserInfo from '../utils/getUserInfo';
import MessageNotificationModal from '../components/ModalPopUp';
import newMsgReceived from '../utils/newMsgSound';
import Notification from '../components/NotificationAlert';

function TabPanel(props) {
	const { profile, children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
}));

function SimpleTabs(props) {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
	const { profile: userProfile, history } = props;

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Tabs
					value={value}
					style={{ backgroundColor: 'rgb(52,58,64)', color: 'white' }}
					onChange={handleChange}
					aria-label="simple tabs example"
				>
					<Tab label="Campgrounds" {...a11yProps(0)} />
					<Tab label="Followers" {...a11yProps(1)} />
					<Tab label="Following" {...a11yProps(2)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<Row>
					{userProfile && userProfile.campgrounds.length === 0 ? <p>No Places posted</p> : null}
					{userProfile &&
						userProfile.campgrounds.map((campground) => {
							return (
								<Col key={campground._id} sm={12} md={6} lg={4}>
									<Fade bottom>
										<Place place={campground} history={history} />
									</Fade>
								</Col>
							);
						})}
				</Row>
			</TabPanel>

			<TabPanel value={value} index={1}>
				<Row>
					<center>
						<h4>{userProfile.followers} followers</h4>
					</center>
				</Row>
			</TabPanel>
			<TabPanel value={value} index={2}>
				<Row>
					<center>
						<h4>{userProfile.following} following</h4>
					</center>
				</Row>
			</TabPanel>
		</div>
	);
}

const UserProfile = ({ match, history }) => {
	const { username } = match.params;

	const dispatch = useDispatch();

	const profileData = useSelector((state) => state.profile);
	const { loading, profile: userProfile, error } = profileData;

	const userStatus = useSelector((state) => state.status);
	const { isLoggedIn, userInfo } = userStatus;

	const followUserStatus = useSelector((state) => state.followUserStatus);
	const { loading: followUserLoading, error: followUserError, follow: followUserFollowing } = followUserStatus;

	useEffect(() => {
		dispatch(profile(username));
	}, [username, match, dispatch]);

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

	return (
		<div>
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
			{loading ? (
				<Facebook />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : userProfile ? (
				<>
					<Row>
						<Col
							xs={12}
							className="profilePic d-flex flex-column justify-content-center align-items-center"
						>
							{userProfile && userProfile.user.profilePic ? (
								<Image
									className=""
									width="200px"
									src={`${userProfile.user.profilePic}`}
									fluid
									rounded
								/>
							) : (
								<Image
									className=""
									width="200px"
									src={`https://avatars.dicebear.com/4.5/api/bottts/${userProfile.user._id}.svg`}
									fluid
									rounded
								/>
							)}
							<h4 className="mt-3">{userProfile && userProfile.user.username}</h4>
							<p>{userProfile && userProfile.user.email}</p>
						</Col>
					</Row>

					<Row className="mt-5">{userProfile && <SimpleTabs profile={userProfile} history={history} />}</Row>
				</>
			) : null}
		</div>
	);
};

export default UserProfile;
