import { ALL_CHATS_FAIL, ALL_CHATS_SUCCESS, ALL_CHATS_REQUEST } from '../constants/chatConstants';

export const allChatsReducer = (state = {}, action) => {
	switch (action.type) {
		case ALL_CHATS_REQUEST:
			return {
				loading: true,
			};
		case ALL_CHATS_SUCCESS:
			return {
				chats: action.payload,
			};
		case ALL_CHATS_FAIL:
			return {
				error: action.payload,
			};
		default:
			return state;
	}
};
