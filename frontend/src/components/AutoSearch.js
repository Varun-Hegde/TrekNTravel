import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Modal, Image } from 'react-bootstrap';
import { Input } from 'reactstrap';

export default function AutoSearch() {
	let cancelToken;
	const [data, setData] = useState('');

	const [show, setShow] = useState(false);

	const handleClose = () => {
		setShow(false);
		setData('');
	};
	const handleShow = () => {
		setShow(true);
		setData('');
	};

	const onType = async (e) => {
		const search = e.target.value;
		setData('');
		if (typeof cancelToken != typeof undefined) {
			cancelToken.cancel('Cancelling the previous request');
		}

		cancelToken = axios.CancelToken.source();
		const result = await axios.get(`/api/search?keyword=${search}`, { cancelToken: cancelToken.token });

		if (result.data) {
			let users = [];
			let campgrounds = [];
			if (result.data.user) {
				for (let d of result.data.user) {
					users.push({
						name: d.username,
						link: `/user-profile/${d.username}`,
						image: d.profilePic ? d.profilePic : `https://avatars.dicebear.com/4.5/api/bottts/${d._id}.svg`,
					});
				}
			}
			if (result.data.campground) {
				for (let d of result.data.campground) {
					campgrounds.push({
						name: d.title,
						link: `/campground/${d._id}`,
						image: d.image[0],
					});
				}
			}

			setData({ campgrounds: campgrounds, users: users });
		}
	};

	return (
		<>
			<p style={{ cursor: 'pointer' }} onClick={handleShow}>
				<i class="fas fa-search"></i> Search
			</p>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Search</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Input type="text" placeholder="Enter Search" onChange={onType} />

					{data && data.campgrounds && data.campgrounds.length > 0 && (
						<>
							<p className="mt-2" style={{ fontSize: '25px', fontStyle: 'italic' }}>
								Campgrounds
							</p>

							{data.campgrounds.map((d) => (
								<Link className="d-flex mt-2" onClick={() => setData('')} to={d.link}>
									<Image height="50" width="50" src={d.image} roundedCircle />
									<p className="ml-2 align-self-center">{d.name}</p>{' '}
								</Link>
							))}

							<hr />
						</>
					)}

					{data && data.users && data.users.length > 0 && (
						<>
							<p className="mt-2" style={{ fontSize: '25px', fontStyle: 'italic' }}>
								People
							</p>

							{data.users.map((d) => (
								<Link className="d-flex mt-2" onClick={() => setData('')} to={d.link}>
									<Image height="50" width="50" src={d.image} roundedCircle />
									<p className="ml-2 align-self-center">{d.name}</p>{' '}
								</Link>
							))}
						</>
					)}

					{!data ||
						(data.campgrounds && data.campgrounds.length === 0 && data.users && data.users.length === 0 && (
							<p className="mt-2" style={{ fontSize: '25px', fontStyle: 'italic' }}>
								No data found
							</p>
						))}
				</Modal.Body>
			</Modal>
		</>
	);
}
