const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const isEmail = require('validator/lib/isEmail');
const asyncHandler = require('express-async-handler');

const options = {
	auth: {
		api_key: process.env.SEND_GRID_API,
	},
};
const transporter = nodemailer.createTransport(sendGridTransport(options));

const baseUrl = 'http://localhost:3000';

// CHECK USER EXISTS AND SEND EMAIL FOR RESET PASSWORD
router.post(
	'/',
	asyncHandler(async (req, res) => {
		const { email } = req.body;

		if (!isEmail(email)) {
			res.status(401);
			throw new Error('Invalid email');
		}

		const user = await User.findOne({ email: email.toLowerCase() });

		if (!user) {
			res.status(404);
			throw new Error('User not found');
		}

		const token = crypto.randomBytes(32).toString('hex');

		user.resetToken = token;
		user.expireToken = Date.now() + 3600000; //token expires in 1 hour

		await user.save();

		const href = `${baseUrl}/reset-password/${token}`;

		const mailOptions = {
			to: user.email,
			from: 'varunhegde2k@gmail.com',
			subject: 'Trek-N-Travel password reset request',
			html: `<p>Hey ${user.username
				.split(' ')[0]
				.toString()}, There was a request for password reset. <a href=${href}>Click this link to reset the password </a>   </p>
      <p>This token is valid for only 1 hour.</p>`,
		};

		transporter.sendMail(mailOptions, (err, info) => err && console.log(err));

		return res.status(200).send('Email sent successfully');
	})
);

// VERIFY THE TOKEN AND RESET THE PASSWORD IN DB

router.post(
	'/token',
	asyncHandler(async (req, res) => {
		const { token, password } = req.body;
		console.log(token, password);
		if (!token) {
			res.status(401);
			throw new Error('Unauthorized');
		}

		if (password.length < 5) {
			res.status(401);
			throw new Error('Password must be >= 5 characters');
		}

		const user = await User.findOne({ resetToken: token });

		if (!user) {
			res.status(404);
			throw new Error('User not found');
		}

		if (Date.now() > user.expireToken) {
			res.status(401);
			throw new Error('Token expired.Generate new one');
		}

		user.local.password = password;

		user.resetToken = '';
		user.expireToken = undefined;

		await user.save();

		return res.status(200).send('Password updated');
	})
);

module.exports = router;
