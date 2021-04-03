import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { Button, Image } from 'react-bootstrap';
import { Form, FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap';
import Zoom from 'react-reveal/Zoom';
import Message from '../components/Message';
import { editPlace } from '../actions/campgroundActions';
import { PLACE_EDIT_RESET } from '../constants/campgroundConstants';
import Loader from '../components/Loader';
import { PLACE_DETAIL_EDITED_PLACE } from '../constants/appConstants';
import { USER_NO_PERMISSION } from '../constants/appConstants';
import axios from 'axios';

const EditCampgroundDetails = ({ history, match }) => {
	const placeId = match.params.id;
	let currentTags = [];

	const placeDetail = useSelector((state) => state.placeDetail);
	const { place, loading: loadingPlace } = placeDetail;
	const dispatch = useDispatch();

	const placeEdit = useSelector((state) => state.placeEdit);
	const { loading: loadingEdit, success: successEdit, error: errorEdit } = placeEdit;

	const statusState = useSelector((state) => state.status);
	const { userInfo: userStatus, isLoggedIn } = statusState;
	console.log(statusState);
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState();
	const [description, setDescription] = useState('');
	const [location, setLocation] = useState('');
	const [image, setImage] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [uploadedImages, setUploadedImages] = useState('');
	const [uploadErr, setUploadErr] = useState(false);
	const [deleteImages, setDeleteImages] = useState([]);

	const [touchedTitle, setTouchedTitle] = useState(false);
	const [touchedPrice, setTouchedPrice] = useState(false);
	const [touchedDescription, setTouchedDescription] = useState(false);
	const [touchedLocation, setTouchedLocation] = useState(false);
	const [touchedImage, setTouchedImage] = useState(false);
	const [touchedUpload, setTouchedUpload] = useState(false);
	const [numOfDeletedImages, setNumofDeletedImages] = useState(0);

	useEffect(() => {
		if (!isLoggedIn) {
			dispatch({ type: USER_NO_PERMISSION });
			history.push(`/campground/${placeId}`);
		}

		if (!place.title) {
			history.push(`/campground/${placeId}`);
		}
		if (successEdit) {
			dispatch({ type: PLACE_EDIT_RESET });
			dispatch({ type: PLACE_DETAIL_EDITED_PLACE });
			history.push(`/campground/${placeId}`);
		}
		setTitle(place.title);
		setImage(place.image);
		setDescription(place.description);
		setPrice(place.price);
		setLocation(place.location);
		setDeleteImages(new Array(image.length));
	}, [dispatch, match, history, placeId, place, successEdit, isLoggedIn]);

	function validate() {
		const errors = {
			title: '',
			price: '',
			location: '',
			image: '',
			desc: '',
		};

		if (touchedTitle && title.length < 3) errors.title = 'Title should be >= 3 characters';

		const reg = /^\d+$/;
		if (touchedPrice && !reg.test(price)) errors.price = 'Price should contain only numbers';
		if (touchedPrice && price < 0) errors.price = 'Price should be greater than zero';

		if (touchedLocation && location.length < 3) {
			errors.location = 'Location should be >= 3 characters';
		}

		if (touchedImage && image.length < 1) {
			errors.image = 'Image Invalid';
		}

		if (touchedDescription && description.length <= 0) errors.desc = 'No Description';

		return errors;
	}

	const errors = validate(title);

	const onFileChange = (e) => {
		setUploadedImages(e.target.files);
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		const imageToBeDeleted = [];
		for (let i = 0; i < deleteImages.length; i++) {
			if (deleteImages[i]) imageToBeDeleted.push(image[i]);
		}
		console.log(imageToBeDeleted);
		var formData = new FormData();
		for (const key of Object.keys(uploadedImages)) {
			formData.append('image', uploadedImages[key]);
		}
		setUploading(true);
		let newImageData;
		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			};
			var { data } = await axios.post('/api/upload', formData, config);
			newImageData = [...image, ...data.filePath];
			setImage(newImageData);
			setUploading(false);
			const campgroundDetails = {
				title,
				price,
				description,
				location,
				image: newImageData,
				deleteImages: imageToBeDeleted,
			};
			dispatch(editPlace(campgroundDetails, placeId));
		} catch (err) {
			setUploading(false);
			setUploadErr(true);
			setTouchedUpload(false);
		}

		//dispatch(editPlace(campgroundDetails,placeId))
	};

	const handleCheckBox = (e, idx) => {
		const newData = [...deleteImages];
		if (newData[idx] === undefined) newData[idx] = true;
		else newData[idx] = !newData[idx];
		setDeleteImages(newData);
		let num = 0;
		for (let i = 0; i < newData.length; i++) {
			if (newData[i]) num++;
		}
		setNumofDeletedImages(num);
	};

	const displayPic = (pic) => {
		return pic.replace('/upload', '/upload/w_300');
	};

	const onTagsChange = (e, values) => {
		console.log(values);
	};
	return (
		<Zoom bottom>
			<Link to={`/campground/${placeId}`} className="btn btn-light my-3">
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit Campground</h1>

				{uploadErr ? <Message variant="danger">File must be in jpg or jpeg or png format</Message> : null}
				<Form onSubmit={submitHandler}>
					<FormGroup>
						<Label htmlFor="title">Title</Label>
						<Input
							type="text"
							id="title"
							name="title"
							placeholder="Campground title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							onBlur={() => setTouchedTitle(true)}
							valid={errors.title === '' && title.length >= 3}
							invalid={errors.title !== ''}
						/>
						<FormFeedback>{errors.title}</FormFeedback>
					</FormGroup>

					<FormGroup>
						<Label htmlFor="price">Price</Label>
						<Input
							type="text"
							id="price"
							name="price"
							placeholder="Campground price"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							onBlur={() => setTouchedPrice(true)}
							valid={errors.price === '' && parseInt(price)}
							invalid={errors.price !== ''}
						/>
						<FormFeedback>{errors.price}</FormFeedback>
					</FormGroup>

					<FormGroup>
						<Label htmlFor="location">Location</Label>
						<Input
							type="text"
							id="location"
							name="location"
							placeholder="Campground location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							onBlur={() => setTouchedLocation(true)}
							valid={errors.location === '' && location.length >= 3}
							invalid={errors.location !== ''}
						/>
						<FormFeedback>{errors.location}</FormFeedback>
					</FormGroup>

					<FormGroup>
						<Label for="exampleFile">File</Label>
						<Input type="file" name="file" id="exampleFile" multiple={true} onChange={onFileChange} />
						<FormText color="muted">Upload images of campground</FormText>
						{uploading && <Loader />}
					</FormGroup>

					<FormGroup>
						<Label htmlFor="desc" id="desc">
							Description
						</Label>
						<Input
							type="textarea"
							name="desc"
							id="desc"
							placeholder="Campground description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							onBlur={() => setTouchedDescription(true)}
							valid={errors.desc === '' && description}
							invalid={errors.desc !== ''}
						/>
						<FormFeedback>{errors.desc}</FormFeedback>
					</FormGroup>

					<div className="mb-3">
						{place &&
							place.image &&
							place.image.map((pic, index) => {
								return (
									<div className="mb-3">
										<Image className="mb-1" src={displayPic(pic)} fluid thumbnail />
										<FormGroup check>
											<Label check>
												<Input
													type="checkbox"
													name="deleteImages[]"
													value={pic}
													onChange={(e) => handleCheckBox(e, index)}
												/>
												Delete
											</Label>
										</FormGroup>
									</div>
								);
							})}
					</div>

					{loadingEdit ? <Loader /> : errorEdit ? <Message variant="danger">{errorEdit}</Message> : null}
					{place && place.image && numOfDeletedImages === place.image.length ? (
						<Message variant="danger">Cannot delete all Images</Message>
					) : null}

					<Button
						block
						type="submit"
						color="primary"
						disabled={
							errors.title ||
							errors.price ||
							errors.location ||
							errors.desc ||
							!title ||
							!price ||
							!location ||
							!description ||
							numOfDeletedImages === place.image.length
						}
					>
						Edit campground
					</Button>
				</Form>
			</FormContainer>
		</Zoom>
	);
};

export default EditCampgroundDetails;
