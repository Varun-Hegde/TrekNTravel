import React from 'react';
import './Map.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ID;

class Map extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lat: 12.9716,
			lng: 77.5946,
			zoom: 8,
		};
	}

	componentDidMount() {
		const map = new mapboxgl.Map({
			container: this.mapContainer,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: this.props.coOrd,
			zoom: this.state.zoom,
		});
		map.addControl(new mapboxgl.NavigationControl());
		// eslint-disable-next-line
		var marker = new mapboxgl.Marker()
			.setLngLat(this.props.coOrd)
			.addTo(map)
			.setPopup(
				new mapboxgl.Popup({ offset: 25 }).setHTML(
					`<p>${this.props.campground.title},<br />${this.props.campground.location}</p>`
				)
			);

		map.on('move', () => {
			this.setState({
				lng: map.getCenter().lng.toFixed(4),
				lat: map.getCenter().lat.toFixed(4),
				zoom: map.getZoom().toFixed(2),
			});
		});
	}

	render() {
		return (
			<div>
				<div className="sidebarStyle"></div>
				<div ref={(el) => (this.mapContainer = el)} className="mapContainer" />
			</div>
		);
	}
}

export default Map;
