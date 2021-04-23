import {
	USER_SIGNIN_FAIL,
	USER_SIGNIN_REQUEST,
	USER_SIGNIN_SUCCESS,
	USER_SIGNUP_FAIL,
	USER_SIGNUP_REQUEST,
	USER_SIGNUP_SUCCESS,
	USER_STATUS_FAIL,
	USER_STATUS_REQUEST,
	USER_STATUS_SUCCESS,
	USER_SIGNOUT_FAIL,
	USER_SIGNOUT_REQUEST,
	USER_SIGNOUT_SUCCESS,
	USER_SIGNIN_RESET,
	USER_SIGNUP_RESET,
	USER_PROFILE_FAIL,
	USER_PROFILE_REQUEST,
	USER_PROFILE_SUCCESS,
	USER_GOOGLE_FAIL,
	USER_GOOGLE_REQUEST,
	USER_GOOGLE_SUCCESS,
	USER_FACEBOOK_FAIL,
	USER_FACEBOOK_REQUEST,
	USER_FACEBOOK_SUCCESS,
	USER_FOLLOW_FAIL,
	USER_FOLLOW_REQUEST,
	USER_FOLLOW_SUCCESS,
	USER_UNFOLLOW_FAIL,
	USER_UNFOLLOW_REQUEST,
	USER_UNFOLLOW_SUCCESS,
	USER_FOLLOW_STATUS_FAIL,
	USER_FOLLOW_STATUS_REQUEST,
	USER_FOLLOW_STATUS_SUCCESS,
	USER_MY_PROFILE_REQUEST,
	USER_MY_PROFILE_FAIL,
	USER_MY_PROFILE_SUCCESS,
	USER_GOOGLE_LINK_FAIL,
	USER_GOOGLE_LINK_REQUEST,
	USER_GOOGLE_LINK_SUCCESS,
	USER_GOOGLE_UNLINK_FAIL,
	USER_GOOGLE_UNLINK_REQUEST,
	USER_GOOGLE_UNLINK_SUCCESS,
	USER_FACEBOOK_LINK_FAIL,
	USER_FACEBOOK_LINK_REQUEST,
	USER_FACEBOOK_LINK_SUCCESS,
	USER_FACEBOOK_UNLINK_FAIL,
	USER_FACEBOOK_UNLINK_REQUEST,
	USER_FACEBOOK_UNLINK_SUCCESS,
	USER_EDIT_REQUEST,
	USER_EDIT_FAIL,
	USER_EDIT_SUCCESS,
} from '../constants/userConstants';

//SIGN UP
export const signUpReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_SIGNUP_REQUEST:
			return {
				loading: true,
				success: false,
			};
		case USER_SIGNUP_SUCCESS:
			return {
				loading: false,
				success: true,
				userInfo: action.payload,
			};
		case USER_SIGNUP_FAIL:
			return {
				loading: false,
				success: false,
				error: action.payload,
			};
		case USER_SIGNUP_RESET:
			return {};
		default:
			return state;
	}
};

//STATUS
export const statusReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_STATUS_REQUEST:
			return {
				loading: true,
				isLoggedIn: false,
			};
		case USER_STATUS_SUCCESS:
			return {
				loading: false,
				isLoggedIn: true,
				userInfo: action.payload,
			};
		case USER_STATUS_FAIL:
			return {
				loading: false,
				error: action.payload,
				isLoggedIn: false,
			};
		default:
			return state;
	}
};

//SIGN IN
export const signInReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_SIGNIN_REQUEST:
			return {
				loading: true,
				success: false,
			};
		case USER_SIGNIN_SUCCESS:
			return {
				loading: false,
				userInfo: action.payload,
				success: true,
			};
		case USER_SIGNIN_FAIL:
			return {
				loading: false,
				error: action.payload,
				success: false,
			};
		case USER_SIGNIN_RESET:
			return {};
		default:
			return state;
	}
};

//SIGN OUT
export const signOutReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_SIGNOUT_REQUEST:
			return {
				loading: true,
				success: false,
			};
		case USER_SIGNOUT_SUCCESS:
			return {
				loading: false,
				success: true,
			};
		case USER_SIGNOUT_FAIL:
			return {
				loading: false,
				success: false,
				error: action.payload,
			};
		default:
			return {};
	}
};

//PROFILE
export const profileReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_PROFILE_REQUEST:
			return {
				loading: true,
			};
		case USER_PROFILE_SUCCESS:
			return {
				loading: false,
				profile: action.payload,
			};
		case USER_PROFILE_FAIL:
			return {
				loading: false,
				error: action.payload,
			};
		default:
			return state;
	}
};

//GOOGLE OAUTH
export const googleOauth = (state = {}, action) => {
	switch (action.type) {
		case USER_GOOGLE_REQUEST:
			return {
				loading: true,
			};
		case USER_GOOGLE_SUCCESS:
			return {
				loading: false,
				success: true,
				userInfo: action.payload,
			};
		case USER_GOOGLE_FAIL:
			return {
				loading: false,
				error: action.payload,
				success: false,
			};
		default:
			return {};
	}
};

//FACEBOOK OAUTH
export const facebookOauth = (state = {}, action) => {
	switch (action.type) {
		case USER_FACEBOOK_REQUEST:
			return {
				loading: true,
			};
		case USER_FACEBOOK_SUCCESS:
			return {
				loading: false,
				success: true,
				userInfo: action.payload,
			};
		case USER_FACEBOOK_FAIL:
			return {
				loading: false,
				error: action.payload,
				success: false,
			};
		default:
			return {};
	}
};

//FOLLOW USER
export const followUserReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_FOLLOW_REQUEST:
			return {
				loading: true,
			};
		case USER_FOLLOW_SUCCESS:
			return {
				loading: false,
				success: true,
			};
		case USER_FOLLOW_FAIL:
			return {
				loading: false,
				error: action.payload,
				success: false,
			};
		default:
			return {};
	}
};

//UNFOLLOW USER
export const unfollowUserReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_UNFOLLOW_REQUEST:
			return {
				loading: true,
			};
		case USER_UNFOLLOW_SUCCESS:
			return {
				loading: false,
				success: true,
			};
		case USER_UNFOLLOW_FAIL:
			return {
				loading: false,
				error: action.payload,
				success: false,
			};
		default:
			return {};
	}
};

//FOLLOW STATUS USER
export const followUserStatusReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_FOLLOW_STATUS_REQUEST:
			return {
				loading: true,
			};
		case USER_FOLLOW_STATUS_SUCCESS:
			return {
				loading: false,
				follow: action.payload,
			};
		case USER_FOLLOW_STATUS_FAIL:
			return {
				loading: false,
				error: action.payload,
				success: false,
			};
		default:
			return {};
	}
};

//USER MY PROFILE
export const myProfileReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_MY_PROFILE_REQUEST:
			return {
				loading: true,
			};
		case USER_MY_PROFILE_SUCCESS:
			return {
				loading: false,
				profile: action.payload,
			};
		case USER_MY_PROFILE_FAIL:
			return {
				loading: false,
				error: action.payload,
			};
		default:
			return {};
	}
};

export const googleLink = (state = {}, action) => {
	switch (action.type) {
		case USER_GOOGLE_LINK_REQUEST:
			return {
				loading: true,
			};
		case USER_GOOGLE_LINK_SUCCESS:
			return {
				success: true,
			};
		case USER_GOOGLE_LINK_FAIL:
			return {
				success: false,
			};
		default:
			return {};
	}
};

export const facebookLink = (state = {}, action) => {
	switch (action.type) {
		case USER_FACEBOOK_LINK_REQUEST:
			return {
				loading: true,
			};
		case USER_FACEBOOK_LINK_SUCCESS:
			return {
				success: true,
			};
		case USER_FACEBOOK_LINK_FAIL:
			return {
				success: false,
			};
		default:
			return {};
	}
};

export const googleUnLink = (state = {}, action) => {
	switch (action.type) {
		case USER_GOOGLE_UNLINK_REQUEST:
			return {
				loading: true,
			};
		case USER_GOOGLE_UNLINK_SUCCESS:
			return {
				success: true,
			};
		case USER_GOOGLE_UNLINK_FAIL:
			return {
				success: false,
			};
		default:
			return {};
	}
};

export const facebookUnLink = (state = {}, action) => {
	switch (action.type) {
		case USER_FACEBOOK_UNLINK_REQUEST:
			return {
				loading: true,
			};
		case USER_FACEBOOK_UNLINK_SUCCESS:
			return {
				success: true,
			};
		case USER_FACEBOOK_UNLINK_FAIL:
			return {
				success: false,
			};
		default:
			return {};
	}
};

export const editProfileReducer = (state, action) => {
	switch (action.type) {
		case USER_EDIT_REQUEST:
			return {
				loading: true,
			};
		case USER_EDIT_SUCCESS:
			return {
				loading: false,
				success: true,
			};
		case USER_EDIT_FAIL:
			return {
				loading: false,
				error: action.payload,
			};
		default:
			return {};
	}
};
