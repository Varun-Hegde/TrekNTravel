import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
	return (
		<footer>
			<Container>
				<Row className="d-flex flex-column">
					<Col className="text-center pb-3">
						<a
							style={{ textDecoration: 'none' }}
							rel="noreferrer"
							target="_blank"
							href="https://github.com/Varun-Hegde"
						>
							Crafted & Developed by Varun with <i style={{ color: 'red' }} className="fas fa-heart"></i>{' '}
						</a>
					</Col>
				</Row>
			</Container>
		</footer>
	);
};

export default Footer;
