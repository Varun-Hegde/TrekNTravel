const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema(
	{
		methods: {
			type: [String],
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		description: {
			type: String,
		},
		profilePic: {
			type: String,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		local: {
			email: {
				type: String,
				lowercase: true,
			},
			password: {
				type: String,
			},
		},
		google: {
			id: {
				type: String,
			},
			email: {
				type: String,
				lowercase: true,
			},
		},
		facebook: {
			id: {
				type: String,
			},
			email: {
				type: String,
				lowercase: true,
			},
		},
		newMessagePopUp: {
			type: Boolean,
			default: true,
		},
		unreadMessage: {
			type: Boolean,
			default: false,
		},

		unreadNotification: {
			type: Boolean,
			default: false,
		},
		resetToken: {
			type: String,
		},
		expireToken: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

UserSchema.pre(
	'save',
	async function (next) {
		try {
			if (!this.methods.includes('local')) {
				return next();
			}

			if (this.isModified('local.password')) {
				//GENERATE A SALT
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(this.local.password, salt);
				this.local.password = hashedPassword;
			}

			next();
		} catch (err) {
			next(err);
		}
	},
	{
		timestamps: true,
	}
);

UserSchema.methods.isValidPassword = async function (newPassword) {
	try {
		return await bcrypt.compare(newPassword, this.local.password);
	} catch (error) {
		throw new Error(error);
	}
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
