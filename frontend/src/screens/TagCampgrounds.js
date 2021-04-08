import React, { useEffect } from 'react';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getTagCampgroundsAction } from '../actions/tagActions';
import Message from '../components/Message';
import { Row, Col } from 'react-bootstrap';
import Fade from 'react-reveal/Fade';
import Place from '../components/Place';
import { Link } from 'react-router-dom';
const TagCampgrounds = ({ history, match }) => {
	const dispatch = useDispatch();

	const tagCampgrounds = useSelector((state) => state.getTagCampgrounds);
	const { loading, error, places } = tagCampgrounds;

	useEffect(() => {
		dispatch(getTagCampgroundsAction(match.params.tagname));
	}, [dispatch, match.params.tagname]);

	return (
		<>
			<Link className="btn btn-light my-3" to="/campgrounds">
				Go Back
			</Link>
			{loading && <Loader />}
			{error && <Message variant="danger">{error}</Message>}

			{places && places[0].places && places[0].places.length > 0 ? (
				<Row>
					{places[0].places.length > 0 ? (
						places[0].places.map((place) => (
							<>
								<Col key={place._id} sm={12}>
									<Fade bottom>
										<Place place={place} history={history} />
									</Fade>
								</Col>
							</>
						))
					) : !loading ? (
						<Message variant="info">No places found. </Message>
					) : null}
				</Row>
			) : null}
		</>
	);
};

export default TagCampgrounds;
