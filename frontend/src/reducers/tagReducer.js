import {
	TAG_FAIL,
	TAG_REQUEST,
	TAG_SUCCESS,
	TAG_CAMPGROUND_FAIL,
	TAG_CAMPGROUND_REQUEST,
	TAG_CAMPGROUND_SUCCESS,
} from '../constants/tagConstants';

export const getTags = (state = { tags: [] }, action) => {
	switch (action.type) {
		case TAG_REQUEST:
			return {
				loading: true,
			};
		case TAG_SUCCESS:
			return {
				loading: false,
				tags: action.payload,
			};
		case TAG_FAIL:
			return {
				loading: false,
				error: action.payload,
			};
		default:
			return state;
	}
};

export const getTagCampgroundsReducer = (state = { tags: [] }, action) => {
	switch (action.type) {
		case TAG_CAMPGROUND_REQUEST:
			return {
				loading: true,
			};
		case TAG_CAMPGROUND_SUCCESS:
			return {
				loading: false,
				places: action.payload,
			};
		case TAG_CAMPGROUND_FAIL:
			return {
				error: action.payload,
			};
		default:
			return state;
	}
};
