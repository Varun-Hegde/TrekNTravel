import { SEARCH_FAIL, SEARCH_REQUEST, SEARCH_SUCCESS } from '../constants/searchConstants';

export const searchReducer = (state = {}, action) => {
	switch (action.type) {
		case SEARCH_REQUEST:
			return {
				loading: true,
			};
		case SEARCH_SUCCESS:
			return {
				loading: false,
				searchInfo: action.payload,
			};
		case SEARCH_FAIL:
			return {
				error: action.payload,
			};
		default:
			return {};
	}
};
