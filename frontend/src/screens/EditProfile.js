import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { Link } from 'react-router-dom';
import { Button, Image } from 'react-bootstrap';
import { Form, FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap';
import { editProfile } from '../actions/userActions';
import axios from 'axios';
import Message from '../components/Message';
import Loader from '../components/Loader';

const EditProfile = ({ history }) => {
	const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.status);
	const { isLoggedIn, userInfo } = userDetails;

	const editProfileReducer = useSelector((state) => state.editProfileReducer);
	const { loading: editLoading, error: editError, success: editSuccess } = editProfileReducer;

	const [desc, setDesc] = useState(isLoggedIn ? userInfo.user.description : '');
	const [dp, setDp] = useState('');
	const [pass1, setPass1] = useState('');
	const [pass2, setPass2] = useState('');
	const [uploadedImages, setUploadedImages] = useState(null);

	const [touchedDesc, setTouchedDesc] = useState(false);
	const [touchedDp, setTouchedDp] = useState(false);
	const [touchedPass1, setTouchedPass1] = useState(false);
	const [touchedPass2, setTouchedPass2] = useState(false);

	const [uploading, setUploading] = useState(false);
	const [uploadingError, setUploadingError] = useState(false);

	useEffect(() => {
		if (!isLoggedIn) {
			history.push('/campgrounds');
		}
	}, [history, isLoggedIn]);

	function validate() {
		const errors = {
			description: '',
			password1: '',
			password2: '',
		};

		if (touchedDesc && desc && desc.length < 3)
			errors.description = 'Description must contain atleast 3 characters';

		if (touchedPass1 && pass1.length < 5) errors.password1 = 'Password should be >= 6 characters';

		if (touchedPass2 && pass2 !== pass1) errors.password2 = 'Passwords do not match';

		return errors;
	}

	const errors = validate();

	const uploadFileHandler = async (e) => {
		setUploadingError(false);
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('image', file);
		setUploading(true);
		console.log(file);
		console.log(formData);

		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			};

			const { data } = await axios.post('/api/upload/profile-photo', formData, config);
			console.log('Image upload', data);
			setDp(data.profilePicUrl);
			setUploading(false);
		} catch (error) {
			setUploading(false);
			setUploadingError(true);
		}
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		let body = {
			description: desc,
			password: pass1,
			profilePic: dp,
		};
		dispatch(editProfile(body));
	};

	useEffect(() => {
		if (editSuccess) history.push('/my-profile');
	}, [editSuccess, history]);

	return (
		<>
			<Link to={`/my-profile`} className="btn btn-light my-3">
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit Profile</h1>
				{editError ? <Message variant="danger">File must be in jpg or jpeg or png format</Message> : null}
				{editLoading ? <Loader /> : null}
				<Form onSubmit={submitHandler}>
					<FormGroup>
						<Label for="exampleFile">File</Label>
						<Input type="file" name="file" id="exampleFile" onChange={uploadFileHandler} />
						<FormText color="muted">Upload images of campground</FormText>
					</FormGroup>
					{uploadingError ? (
						<Message variant="danger">File must be in jpg or jpeg or png format</Message>
					) : null}
					{uploading ? <Loader /> : null}
					<FormGroup>
						<Label htmlFor="password1">Password</Label>
						<Input
							type="password"
							id="password1"
							name="password1"
							placeholder="New Password"
							value={pass1}
							onChange={(e) => setPass1(e.target.value)}
							onBlur={() => setTouchedPass1(true)}
							valid={errors.password1 === ''}
							invalid={errors.password1 !== ''}
						/>
						<FormFeedback>{errors.password1}</FormFeedback>
					</FormGroup>

					<FormGroup>
						<Label htmlFor="password2">Confirm Password</Label>
						<Input
							type="password"
							id="password2"
							name="password2"
							placeholder="Confirm your new password"
							value={pass2}
							onChange={(e) => setPass2(e.target.value)}
							onBlur={() => setTouchedPass2(true)}
							valid={errors.password2 === ''}
							invalid={errors.password2 !== ''}
						/>
						<FormFeedback>{errors.password2}</FormFeedback>
					</FormGroup>

					<FormGroup>
						<Label htmlFor="desc" id="desc">
							Description
						</Label>
						<Input
							type="textarea"
							name="desc"
							id="desc"
							placeholder="Your description"
							value={desc}
							onChange={(e) => setDesc(e.target.value)}
							onBlur={() => setTouchedDesc(true)}
							valid={errors.description === '' && desc}
							invalid={errors.description !== ''}
						/>
						<FormFeedback>{errors.description}</FormFeedback>
					</FormGroup>
					<Button
						block
						type="submit"
						color="primary"
						disabled={
							errors.description || errors.password1 || errors.password2 || !desc || !pass1 || !pass2
						}
					>
						Edit Profile
					</Button>
				</Form>
			</FormContainer>
		</>
	);
};

export default EditProfile;
