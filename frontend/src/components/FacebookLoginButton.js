import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useDispatch } from 'react-redux';
import { facebookOauth } from '../actions/userActions';
import { Button } from 'react-bootstrap';

const FacebookLoginButton = () => {
	const dispatch = useDispatch();

	const responseFacebook = (res) => {
		const data = {
			access_token: res.accessToken,
		};
		console.log(data);
		dispatch(facebookOauth(data));
	};

	return (
		<FacebookLogin
			appId={process.env.REACT_APP_FACEBOOK_APP_ID}
			render={(renderProps) => (
				<Button variant="primary" className="facebook" onClick={renderProps.onClick}>
					<i style={{ fontSize: '20px' }} className="fab fa-facebook-f pr-2"></i> Facebook
				</Button>
			)}
			fields="name,email,picture"
			cssClass="btn btn-outline-primary"
			callback={responseFacebook}
		/>
	);
};

export default FacebookLoginButton;
