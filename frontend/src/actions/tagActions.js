import axios from 'axios';

import {
	TAG_FAIL,
	TAG_REQUEST,
	TAG_SUCCESS,
	TAG_CAMPGROUND_FAIL,
	TAG_CAMPGROUND_REQUEST,
	TAG_CAMPGROUND_SUCCESS,
} from '../constants/tagConstants';

export const listTags = (keyword = '') => async (dispatch) => {
	try {
		dispatch({
			type: TAG_REQUEST,
		});

		const { data } = await axios.get(`/api/tags?keyword=${keyword}`);

		dispatch({
			type: TAG_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: TAG_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

//get campgrounds of a particular tag
export const getTagCampgroundsAction = (keyword) => async (dispatch) => {
	try {
		dispatch({
			type: TAG_CAMPGROUND_REQUEST,
		});

		const { data } = await axios.get(`/api/tags/campgrounds?tag=${keyword}`);
		console.log(data);
		dispatch({
			type: TAG_CAMPGROUND_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: TAG_CAMPGROUND_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
