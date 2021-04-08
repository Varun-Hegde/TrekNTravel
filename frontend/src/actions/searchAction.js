import axios from 'axios';
import { SEARCH_FAIL, SEARCH_REQUEST, SEARCH_SUCCESS } from '../constants/searchConstants';

export const searchAction = (keyword = '') => async (dispatch) => {
	try {
		dispatch({
			type: SEARCH_REQUEST,
		});

		const { data } = await axios.get(`/api/search?keyword=${keyword}`);

		dispatch({
			type: SEARCH_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: SEARCH_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
