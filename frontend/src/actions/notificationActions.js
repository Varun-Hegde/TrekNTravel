import { NOTIFICATION_FAIL, NOTIFICATION_REQUEST, NOTIFICATION_SUCCESS } from '../constants/notificationConstants';

import axios from 'axios';

export const getNotifications = () => async (dispatch) => {
	try {
		dispatch({
			type: NOTIFICATION_REQUEST,
		});

		const { data } = await axios.get('/api/notifications');

		dispatch({
			type: NOTIFICATION_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: NOTIFICATION_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message,
		});
	}
};
