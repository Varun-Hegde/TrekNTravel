import { NOTIFICATION_FAIL, NOTIFICATION_REQUEST, NOTIFICATION_SUCCESS } from '../constants/notificationConstants';

export const getNotificationsReducer = (state = {}, action) => {
	switch (action.type) {
		case NOTIFICATION_REQUEST:
			return {
				loading: true,
			};
		case NOTIFICATION_SUCCESS:
			return {
				notifications: action.payload,
				success: true,
			};
		case NOTIFICATION_FAIL:
			return {
				success: false,
				error: action.payload,
			};
		default:
			return state;
	}
};
