import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import Place from '../components/Place';
import { listPlaces, listMyFeed } from '../actions/campgroundActions';
import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { listTags } from '../actions/tagActions';
import AutoSearch from '../components/AutoSearch';

const HomeScreen = ({ history, match }) => {
	const dispatch = useDispatch();

	const [feed, setFeed] = useState('globalfeed');

	const placeList = useSelector((state) => state.placeList);
	const { loading: allLoading, error: allError, places: allPlaces, page: allPage, pages: allPages } = placeList;

	const placeMyFeedList = useSelector((state) => state.placeMyFeedList);
	const { loading, error, places, page, pages } = placeMyFeedList;

	const userStatus = useSelector((state) => state.status);
	const { isLoggedIn, userInfo } = userStatus;

	const pageNumber = match.params.pageNumber ? match.params.pageNumber : '1';
	console.log(pageNumber);
	useEffect(() => {
		if (!isLoggedIn) {
			dispatch(listPlaces(pageNumber));
		} else {
			if (feed === 'globalfeed') dispatch(listPlaces(pageNumber));
			if (feed === 'myfeed') dispatch(listMyFeed(pageNumber));
		}

		window.scrollTo(0, 0);
	}, [dispatch, pageNumber, match, feed, isLoggedIn]);

	useEffect(() => {
		dispatch(listTags());
	}, [dispatch, places]);

	return (
		<>
			<div>
				{isLoggedIn && (
					<Button
						onClick={() => setFeed('myfeed')}
						active={feed === 'myfeed'}
						className="btn btn-light mb-3 "
					>
						Your Feed
					</Button>
				)}

				<Button
					onClick={() => setFeed('globalfeed')}
					active={feed === 'globalfeed'}
					className="btn btn-light ml-3 mb-3"
				>
					Global Feed
				</Button>
			</div>
			{feed === 'globalfeed' ? (
				<>
					{allLoading ? (
						<Loader />
					) : allError ? (
						<Message variant="danger">{error}</Message>
					) : (
						<>
							<Row>
								{allPlaces.length > 0 ? (
									allPlaces.map((place) => (
										<Col key={place._id} sm={12} md={6} lg={4}>
											<Fade bottom>
												<Place place={place} history={history} />
											</Fade>
										</Col>
									))
								) : (
									<Message variant="info">No places found. </Message>
								)}
							</Row>
							<Fade bottom>
								<Row>
									<Col sm={12} className="d-flex justify-content-center">
										<Paginate pages={allPages} page={allPage} />
									</Col>
								</Row>
							</Fade>
						</>
					)}
				</>
			) : (
				<>
					{loading ? (
						<Loader />
					) : error ? (
						<Message variant="danger">You must be signed in to view your feed</Message>
					) : (
						<>
							<Row>
								{places.length > 0 ? (
									places.map((place) => (
										<Col key={place._id} sm={12} md={6} lg={4}>
											<Fade bottom>
												<Place place={place} history={history} />
											</Fade>
										</Col>
									))
								) : (
									<Message variant="info">No places found. </Message>
								)}
							</Row>
							<Fade bottom>
								<Row>
									<Col sm={12} className="d-flex justify-content-center">
										<Paginate pages={pages} page={page} />
									</Col>
								</Row>
							</Fade>
						</>
					)}
				</>
			)}
		</>
	);
};

export default HomeScreen;
