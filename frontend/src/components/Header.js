import React, { useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { signout, status } from '../actions/userActions';
import { getNotifications } from '../actions/notificationActions';
import AutoSearch from './AutoSearch';
import moment from 'moment';

function dropdown(username, text, date) {
	return (
		<>
			<div>
				<div>
					{username} {text}
				</div>
				<div>{moment(date, 'YYYYMMDD').fromNow()}</div>
			</div>
		</>
	);
}

const Header = () => {
	const dispatch = useDispatch();
	const userStatus = useSelector((state) => state.status);
	const { isLoggedIn, userInfo } = userStatus;

	const signOutDetails = useSelector((state) => state.signOut);
	const { success, error } = signOutDetails;

	const allNotifications = useSelector((state) => state.getNotificationReducer);
	const {
		loading: loadingNotificaton,
		success: successNotificaton,
		error: errorNotificaton,
		notifications,
	} = allNotifications;

	useEffect(() => {
		dispatch(status());
	}, [success, error, dispatch]);

	useEffect(() => {
		if (isLoggedIn) dispatch(getNotifications());
	}, [dispatch, isLoggedIn]);

	const logoutHandler = () => {
		dispatch(signout());
	};

	return (
		<header>
			<Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
				<Container>
					<LinkContainer to="/">
						<Navbar.Brand onClick={() => dispatch({ type: 'PATH' })}>Trek-N-Travel</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav>
							<LinkContainer to="/campgrounds" exact>
								<Nav.Link>
									<i class="fas fa-campground"></i> Campgrounds
								</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/newcampground">
								<Nav.Link>
									<i class="fas fa-plus-square"></i> New Place
								</Nav.Link>
							</LinkContainer>
						</Nav>
						<Nav className="ml-auto">
							<Nav.Link>
								<AutoSearch />
							</Nav.Link>
							{userInfo ? (
								<>
									<NavDropdown
										title={<i style={{ fontSize: '20px' }} className="far fa-envelope"></i>}
										id="notifications"
									>
										{notifications && notifications.notifications.length > 0 ? (
											<>
												{notifications.notifications.map((notification) => {
													if (notification.type === 'newLike') {
														return (
															<>
																<LinkContainer
																	to={`/campground/${notification.post._id}`}
																>
																	<NavDropdown.Item>
																		{dropdown(
																			notification.user.username,
																			' liked your post',
																			notification.date
																		)}
																	</NavDropdown.Item>
																</LinkContainer>
																<hr />
															</>
														);
													} else if (notification.type === 'newComment') {
														return (
															<>
																<LinkContainer
																	to={`/campground/${notification.post._id}`}
																>
																	<NavDropdown.Item>
																		{dropdown(
																			notification.user.username,
																			' commented on your post,',
																			notification.date
																		)}
																	</NavDropdown.Item>
																</LinkContainer>
																<hr />
															</>
														);
													} else if (notification.type === 'newPost') {
														return (
															<NavDropdown.Item>
																{notification.user.username} added new post
															</NavDropdown.Item>
														);
													} else if (notification.type === 'newFollower') {
														return (
															<>
																<LinkContainer
																	to={`/user-profile/${notification.user.username}`}
																>
																	<NavDropdown.Item>
																		{dropdown(
																			notification.user.username,
																			' started following you,',
																			notification.date
																		)}
																	</NavDropdown.Item>
																</LinkContainer>
																<hr />
															</>
														);
													}
													return 0;
												})}
											</>
										) : (
											<>
												<NavDropdown.Item>No Notifications</NavDropdown.Item>
											</>
										)}
									</NavDropdown>

									<NavDropdown title={userInfo.user.username} id="username">
										<LinkContainer to="/my-profile">
											<NavDropdown.Item>Profile</NavDropdown.Item>
										</LinkContainer>
										<NavDropdown.Item onClick={logoutHandler}>Sign Out</NavDropdown.Item>
									</NavDropdown>
								</>
							) : (
								<>
									<LinkContainer to="/signup">
										<Nav.Link>
											<i class="fas fa-user-plus"></i> Sign Up
										</Nav.Link>
									</LinkContainer>
									<LinkContainer to="/signin">
										<Nav.Link>
											<i class="fas fa-user"></i> Sign In
										</Nav.Link>
									</LinkContainer>
								</>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
