import React from 'react';
import { Button } from 'react-bootstrap';
import { linkGoogleAction, unlinkGoogleAction, linkFacebookAction, unlinkFacebookAction } from '../actions/userActions';
import { useDispatch } from 'react-redux';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const Accounts = ({ profile }) => {
	console.log(profile);
	const dispatch = useDispatch();
	const responseGoogle = (res) => {
		const data = {
			access_token: res.accessToken,
		};
		console.log(data);
		dispatch(linkGoogleAction(data));
	};

	const responseFacebook = (res) => {
		const data = {
			access_token: res.accessToken,
		};
		console.log(data);
		dispatch(linkFacebookAction(data));
	};

	const unLinkGoogle = () => {
		dispatch(unlinkGoogleAction());
	};

	const unlinkFacebook = () => {
		dispatch(unlinkFacebookAction());
	};

	return (
		<div className="d-flex flex-column">
			<div className="mb-4">
				<h4 style={{ fontStyle: 'italic' }}>Google:</h4>
				{profile.methods.indexOf('google') !== -1 ? (
					<Button onClick={unLinkGoogle} style={{ maxWidth: '200px' }} variant="outline-danger">
						<center>
							<i style={{ fontSize: '20px' }} class="fab fa-google pr-2"></i>Unlink Google
						</center>
					</Button>
				) : (
					<GoogleLogin
						clientId="191396252820-3cmrdlajhok0enub0mr6ij577g2ruc7f.apps.googleusercontent.com"
						render={(renderProps) => (
							<Button
								style={{ maxWidth: '200px' }}
								variant="danger"
								className="google"
								onClick={renderProps.onClick}
								disabled={renderProps.disabled}
							>
								<center>
									<i style={{ fontSize: '20px' }} class="fab fa-google pr-2"></i>Link Google
								</center>
							</Button>
						)}
						onSuccess={responseGoogle}
						onFailure={responseGoogle}
						className="btn btn-outline-danger"
					/>
				)}
			</div>

			<div>
				<h4 style={{ fontStyle: 'italic' }}>Facebook:</h4>
				{profile.methods.indexOf('facebook') !== -1 ? (
					<Button onClick={unlinkFacebook} className="facebook" style={{ maxWidth: '200px' }}>
						<center>
							<i style={{ fontSize: '20px' }} class="fab fa-facebook-f pr-2"></i>Unlink Facebook
						</center>
					</Button>
				) : (
					<FacebookLogin
						appId="188326146161766"
						render={(renderProps) => (
							<Button variant="primary" className="facebook" onClick={renderProps.onClick}>
								<i style={{ fontSize: '20px' }} className="fab fa-facebook-f pr-2"></i>Link Facebook
							</Button>
						)}
						fields="name,email,picture"
						cssClass="btn btn-outline-primary"
						callback={responseFacebook}
					/>
				)}
			</div>
		</div>
	);
};

export default Accounts;
