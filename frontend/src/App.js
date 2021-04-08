import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import PlaceDetailScreen from './screens/PlaceDetailScreen';
import AddNewCampground from './screens/AddNewCampground';
import EditCampgroundDetails from './screens/EditCampgroundDetails';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import { toast } from 'react-toastify';
import PopUp from './components/PopUp';
import LandingScreen from './screens/LandingScreen';
import ProfileScreen from './screens/ProfileScreen';
import UserProfile from './screens/UserProfile';
import EditProfile from './screens/EditProfile';
import TagCampground from './screens/TagCampgrounds';

import {
	USER_SIGNEDIN_RESET,
	PLACE_LIST_ADDED_PLACE_REMOVE,
	PLACE_DETAIL_EDITED_PLACE_REMOVE,
	USER_SIGNEDUP_RESET,
	USER_SIGNOUT_RESET,
	USER_LOGIN_REQUIRED_RESET,
	USER_NO_PERMISSION_RESET,
} from './constants/appConstants';
import { status } from './actions/userActions';

function App() {
	const [pathN, setPath] = useState();
	const dispatch = useDispatch();
	const appDetail = useSelector((state) => state.appDetails);
	const {
		signInPopUp,
		addedPlacePopup,
		editedPlacePopup,
		signUpPopUp,
		signOutPopUp,
		userLoginPopUp,
		userNoPermission,
		path,
	} = appDetail;

	useEffect(() => {
		dispatch(status());
	}, [dispatch]);

	useEffect(() => {
		setPath(window.location.pathname);
	});

	const popUpMsg = (displayText) => {
		toast.success(displayText, {
			position: 'top-center',
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};

	useEffect(() => {
		if (signInPopUp) {
			popUpMsg('Login Successfull');
			dispatch({ type: USER_SIGNEDIN_RESET });
		}
		if (addedPlacePopup) {
			popUpMsg('Added New Campground');
			dispatch({ type: PLACE_LIST_ADDED_PLACE_REMOVE });
		}
		if (editedPlacePopup) {
			popUpMsg('Edited campground');
			dispatch({ type: PLACE_DETAIL_EDITED_PLACE_REMOVE });
		}
		if (signUpPopUp) {
			popUpMsg('Successfully created an account');
			dispatch({ type: USER_SIGNEDUP_RESET });
		}
		if (signOutPopUp) {
			popUpMsg('Successfully logged out');
			dispatch({ type: USER_SIGNOUT_RESET });
		}
		if (userLoginPopUp) {
			popUpMsg('You need to Login to perform this action');
			dispatch({ type: USER_LOGIN_REQUIRED_RESET });
		}
		if (userNoPermission) {
			popUpMsg('You do not have permission to do this');
			dispatch({ type: USER_NO_PERMISSION_RESET });
		}
	}, [
		signInPopUp,
		addedPlacePopup,
		editedPlacePopup,
		signUpPopUp,
		signOutPopUp,
		userLoginPopUp,
		userNoPermission,
		dispatch,
	]);

	return (
		<>
			{path === '/' || pathN === '/' ? (
				<Router>
					<LandingScreen />
				</Router>
			) : (
				<Router>
					<Header />
					<PopUp />
					<main className="py-3">
						<div className="container">
							<Switch>
								<Route exact path="/newcampground" component={AddNewCampground} />
								<Route exact path="/campground/:id/edit" component={EditCampgroundDetails} />
								<Route exact path="/campground/:id" component={PlaceDetailScreen} />
								<Route exact path="/signup" component={SignUpScreen} />
								<Route exact path="/signin" component={SignInScreen} />
								<Route exact path="/campgrounds" component={HomeScreen} />
								<Route exact path="/my-profile" component={ProfileScreen} />
								<Route exact path="/user-profile/:username" component={UserProfile} />
								<Route exact path="/landing" component={LandingScreen} />
								<Route exact path="/campgrounds/page/:pageNumber" component={HomeScreen} />
								<Route exact path="/edit-profile" component={EditProfile} />
								<Route exact path="/tags/:tagname" component={TagCampground} />
							</Switch>
						</div>
					</main>
					<Footer />
				</Router>
			)}
		</>
	);
}

export default App;
