import { TAG_FAIL, TAG_REQUEST, TAG_SUCCESS } from '../constants/tagConstants';

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
				error: action.payload,
			};
		default:
			return {};
	}
};
