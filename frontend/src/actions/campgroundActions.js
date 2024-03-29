import {
	PLACE_LIST_FAIL,
	PLACE_LIST_REQUEST,
	PLACE_LIST_SUCCESS,
	PLACE_LIST_MY_FEED_FAIL,
	PLACE_LIST_MY_FEED_REQUEST,
	PLACE_LIST_MY_FEED_SUCCESS,
	PLACE_DETAIL_FAIL,
	PLACE_DETAIL_REQUEST,
	PLACE_DETAIL_SUCCESS,
	PLACE_CREATE_FAIL,
	PLACE_CREATE_REQUEST,
	PLACE_CREATE_SUCCESS,
	PLACE_EDIT_FAIL,
	PLACE_EDIT_REQUEST,
	PLACE_EDIT_SUCCESS,
	PLACE_DELETE_FAIL,
	PLACE_DELETE_REQUEST,
	PLACE_DELETE_SUCCESS,
	PLACE_REVIEW_ADD_FAIL,
	PLACE_REVIEW_ADD_REQUEST,
	PLACE_REVIEW_ADD_SUCCESS,
	PLACE_LIKE_FAIL,
	PLACE_LIKE_REQUEST,
	PLACE_LIKE_SUCCESS,
	EDIT_REVIEW_FAIL,
	EDIT_REVIEW_REQUEST,
	EDIT_REVIEW_SUCCESS,
	DELETE_REVIEW_FAIL,
	DELETE_REVIEW_REQUEST,
	DELETE_REVIEW_SUCCESS,
} from '../constants/campgroundConstants';

import { PLACE_LIST_ADDED_PLACE, PLACE_DETAIL_EDITED_PLACE } from '../constants/appConstants';

import axios from 'axios';

//GET ALL PLACES
export const listPlaces = (pageNumber = '') => async (dispatch) => {
	try {
		dispatch({
			type: PLACE_LIST_REQUEST,
		});

		const { data } = await axios.get(`/api/campgrounds?pageNumber=${pageNumber}`);

		dispatch({
			type: PLACE_LIST_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PLACE_LIST_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

//GET MY FEED
export const listMyFeed = (pageNumber = '') => async (dispatch) => {
	try {
		dispatch({
			type: PLACE_LIST_MY_FEED_REQUEST,
		});

		const { data } = await axios.get(`/api/campgrounds/my-feed?pageNumber=${pageNumber}`);

		dispatch({
			type: PLACE_LIST_MY_FEED_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PLACE_LIST_MY_FEED_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

//GET A PARTICULAR PLACE DETAIL
export const placeDetails = (id) => async (dispatch) => {
	try {
		dispatch({
			type: PLACE_DETAIL_REQUEST,
		});

		const { data } = await axios.get(`/api/campgrounds/${id}`);
		dispatch({
			type: PLACE_DETAIL_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PLACE_DETAIL_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

//ADD NEW PLACE
export const addPlace = (campground) => async (dispatch) => {
	try {
		dispatch({
			type: PLACE_CREATE_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const { data } = await axios.post('/api/campgrounds/', campground, config);

		dispatch({
			type: PLACE_CREATE_SUCCESS,
			payload: data,
		});
		dispatch({
			type: PLACE_LIST_ADDED_PLACE,
		});
	} catch (error) {
		dispatch({
			type: PLACE_CREATE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

//EDIT PLACE
export const editPlace = (campground, id) => async (dispatch) => {
	try {
		dispatch({
			type: PLACE_EDIT_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const { data } = await axios.put(`/api/campgrounds/${id}`, campground, config);

		dispatch({
			type: PLACE_EDIT_SUCCESS,
			payload: data,
		});
		dispatch({
			type: PLACE_DETAIL_EDITED_PLACE,
		});
	} catch (error) {
		dispatch({
			type: PLACE_EDIT_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

//DELETE PLACE
export const deletePlace = (id) => async (dispatch) => {
	try {
		dispatch({
			type: PLACE_DELETE_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const { data } = await axios.delete(`/api/campgrounds/${id}`, config);

		dispatch({
			type: PLACE_DELETE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PLACE_DELETE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

//ADD NEW REVIEW TO A PLACE
export const addReview = (body, rating, campId) => async (dispatch) => {
	try {
		dispatch({
			type: PLACE_REVIEW_ADD_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const { data } = await axios.post(`/api/campgrounds/${campId}/reviews`, { body, rating }, config);

		dispatch({
			type: PLACE_REVIEW_ADD_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PLACE_REVIEW_ADD_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

//LIKE
export const likeAction = (id) => async (dispatch) => {
	try {
		dispatch({
			type: PLACE_LIKE_REQUEST,
		});
		// eslint-disable-next-line
		const { data } = await axios.post(`/api/campgrounds/${id}/like`);

		dispatch({
			type: PLACE_LIKE_SUCCESS,
		});
	} catch (error) {
		dispatch({
			type: PLACE_LIKE_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const editReviewAction = (id, reviewId, review) => async (dispatch) => {
	try {
		dispatch({
			type: EDIT_REVIEW_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const data = await axios.put(`/api/campgrounds/${id}/reviews/${reviewId}`, review, config);

		dispatch({
			type: EDIT_REVIEW_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: EDIT_REVIEW_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const deleteReviewAction = (id, reviewId) => async (dispatch) => {
	try {
		dispatch({
			type: DELETE_REVIEW_REQUEST,
		});

		const data = await axios.delete(`/api/campgrounds/${id}/reviews/${reviewId}`);

		dispatch({
			type: DELETE_REVIEW_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: DELETE_REVIEW_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
