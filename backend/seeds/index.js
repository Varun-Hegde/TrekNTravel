const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campgroundModel');
const User = require('../models/userModel');
const Tag = require('../models/tagModel');

mongoose.connect('mongodb+srv://varun:varun@cluster0.t7npb.mongodb.net/TrekNTravel?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	await User.deleteMany({});
	await Tag.deleteMany({});
	const newUser = new User({
		methods: ['local'],
		username: 'Admin',
		email: 'admin@gmail.com',
		isAdmin: true,
		local: {
			email: 'admin@gmail.com',
			password: 'admin',
		},
	});
	const addedUser = await newUser.save();
	let tag = new Tag({ tag: 'Trekking' });
	tag = await tag.save();
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;

		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			price,
			geometry: {
				type: 'Point',
				coordinates: [cities[random1000].longitude, cities[random1000].latitude],
			},
			image: [
				'https://res.cloudinary.com/varunhegde/image/upload/v1611088332/TrekNTravel/rs2iulsugbed4fra8nsm.png',
				'https://res.cloudinary.com/varunhegde/image/upload/v1611088332/TrekNTravel/ucwtg3lqhvahycvxnoqm.png',
			],
			author: addedUser._id,
			tags: [tag],
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
