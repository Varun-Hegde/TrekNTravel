import axios from 'axios';

const getUserInfo = async (userToFind) => {
	try {
		const res = await axios.get(`/api/chats/user/${userToFind}`);

		return { name: res.data.name, profilePic: res.data.profilePic };
	} catch (err) {
		alert('Error Looking for user');
	}
};

export default getUserInfo;
