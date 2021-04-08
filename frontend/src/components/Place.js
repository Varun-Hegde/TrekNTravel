import { Image, Row, Col } from 'react-bootstrap';
import React from 'react';
import './Place.css';
import moment from 'moment';

const Place = ({ place, history }) => {
	const clickHandler = () => {
		history.push(`/campground/${place._id}`);
	};
	return (
		<>
			<div onClick={clickHandler} className="my-2 mx-1 p-1 rounded place">
				<Row>
					<Col sm={12} md={5} lg={3} className="align-self-center">
						<Image src={place.image[0]} rounded fluid />
					</Col>
					<Col className="place__details" sm={12} md={7}>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div>
								<p className="place__title">{place.title}</p>
								<p className="place__desc">{place.description.substring(0, 350)} ......</p>
							</div>
							<div>
								<i class="fas fa-thumbs-up"></i> {place.likes.length}
							</div>
						</div>
						<div className="place__bottom">
							<p className="place__loc">
								<i class="fas fa-map-marker-alt"></i> {place.location}
							</p>
							<p>{moment(place.createdAt, 'YYYYMMDD').fromNow()}</p>
						</div>
						<hr />
					</Col>
				</Row>
			</div>
		</>
	);
};

export default Place;
