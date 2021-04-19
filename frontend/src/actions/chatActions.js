import axios from 'axios';
import {
	SEARCH_CHAT_USER_FAIL,
	SEARCH_CHAT_USER_REQUEST,
	SEARCH_CHAT_USER_SUCCESS,
	ALL_CHATS_FAIL,
	ALL_CHATS_SUCCESS,
	ALL_CHATS_REQUEST,
} from '../constants/chatConstants';

export const searchUserAction = (keyword = '') => async (dispatch) => {
	try {
		dispatch({
			type: SEARCH_CHAT_USER_REQUEST,
		});

		const { data } = await axios.get(`/api/search-user?keyword=${keyword}`);

		dispatch({
			type: SEARCH_CHAT_USER_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: SEARCH_CHAT_USER_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};

export const allChats = () => async (dispatch) => {
	try {
		dispatch({
			type: ALL_CHATS_REQUEST,
		});

		const { data } = await axios.get('/api/chats');

		dispatch({
			type: ALL_CHATS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: ALL_CHATS_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
