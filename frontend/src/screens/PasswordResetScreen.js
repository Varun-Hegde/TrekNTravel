import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Loader from '../components/Loader';
const PasswordResetScreen = ({ history, match }) => {
	const [newPassword, setNewPassword] = useState({ field1: '', field2: '' });

	const { field1, field2 } = newPassword;

	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);
	const [success, setSuccess] = useState(false);

	const userStatus = useSelector((state) => state.status);
	const { isLoggedIn, userInfo } = userStatus;

	useEffect(() => {
		if (isLoggedIn || (userInfo && userInfo.user)) history.push('/campgrounds');
	}, [userInfo, isLoggedIn, history]);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setNewPassword((prev) => ({ ...prev, [name]: value }));
	};

	const resetPassword = async (e) => {
		e.preventDefault();
		setErrorMsg('');
		if (field1 !== field2) {
			return setErrorMsg('Passwords do not match');
		}

		if (field1.length < 5) {
			return setErrorMsg('Password should be >= 5 characters');
		}
		setLoading(true);
		try {
			await axios.post(`/api/reset-password/token`, {
				password: field1,
				token: match.params.token,
			});
			setLoading(false);
			setSuccess(true);
		} catch (error) {
			setErrorMsg(error.response && error.response.data.message ? error.response.data.message : error.message);
			setLoading(false);
		}

		setLoading(false);
	};

	return (
		<FormContainer>
			<h2>Reset password</h2>
			{errorMsg ? <Message variant="danger">{errorMsg}</Message> : null}
			{loading && <Loader />}

			{!success ? (
				<Form onSubmit={resetPassword}>
					<FormGroup>
						<Label htmlFor="password">New Password</Label>
						<Input
							type="password"
							id="password"
							name="field1"
							placeholder="Enter new password"
							value={field1}
							onChange={handleChange}
						/>
					</FormGroup>

					<FormGroup>
						<Label htmlFor="password">Password</Label>
						<Input
							type="password"
							id="password"
							name="field2"
							placeholder="Confirm password"
							value={field2}
							onChange={handleChange}
						/>
					</FormGroup>
					<Button block type="submit" color="primary">
						Reset password
					</Button>
				</Form>
			) : (
				<Message variant="info">
					Password reset successful. <Link to="/signin">Login Again</Link>
				</Message>
			)}
		</FormContainer>
	);
};

export default PasswordResetScreen;
