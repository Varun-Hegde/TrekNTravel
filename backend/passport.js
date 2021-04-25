const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-token').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');

const User = require('./models/userModel');

const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies.access_token;
	}
	return token;
};

//JWT STRATEGY
//CAN BE USED TO CHECK WHEHER A USER IS SIGNED IN OR NOT
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: cookieExtractor,
			secretOrKey: process.env.JWTSecret,
			passReqToCallback: true,
		},
		async (req, payload, done) => {
			try {
				const user = await User.findById(payload.sub);
				if (!user) {
					return done(null, false);
				}
				req.user = user;
				done(null, user);
			} catch (error) {
				done(error, false);
			}
		}
	)
);

//LOCAL STRATEGY
passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				const user = await User.findOne({ email });

				if (!user) {
					return done(null, false);
				}
				const isMatch = await user.isValidPassword(password);
				if (!isMatch) {
					return done(null, false);
				}
				req.user = user;
				done(null, user);
			} catch (err) {
				done(err, false);
			}
		}
	)
);

//GOOGLE STRATEGY
passport.use(
	'googleToken',
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			passReqToCallback: true,
		},
		async (req, accessToken, refreshToken, profile, done) => {
			try {
				//Could get accessed in 2 ways:
				// 1. When registering for 1st time
				// 2. When linking account to existing one

				//Aldready logged in,need to link account
				//Add google's data to an existing account

				if (req.user) {
					//Check if aldready linked account
					const googleStrPos = req.user.methods.indexOf('google');
					if (googleStrPos >= 0) {
						//done('You have aldready linked your google account',null)
						throw new Error('You have aldready linked your google account');
					}

					req.user.methods.push('google');
					req.user.google = {
						id: profile.id,
						email: profile.emails[0].value,
					};
					await req.user.save();
					done(null, req.user);
				} else {
					//In account creation process
					//CHECK WHETHER THIS USER EXISTS IN OUR DB
					let existingUser = await User.findOne({ 'google.id': profile.id });
					if (existingUser) {
						return done(null, existingUser);
					}

					existingUser = await User.findOne({ 'local.email': profile.emails[0].value });
					if (existingUser) {
						//We need to merge google's data with local auth
						existingUser.methods.push('google');
						existingUser.google = {
							id: profile.id,
							email: profile.emails[0].value,
						};
						await existingUser.save();
						return done(null, existingUser);
					}

					const newUser = new User({
						methods: ['google'],
						username: profile.emails[0].value.split('@')[0],
						email: profile.emails[0].value,
						profilePic: profile._json.picture,
						google: {
							id: profile.id,
							email: profile.emails[0].value,
						},
					});
					req.user = newUser;
					await newUser.save();
					return done(null, newUser);
				}
			} catch (err) {
				done(err, false, err.message);
			}
		}
	)
);

//FACEBOOK STRATEGY
passport.use(
	'facebookToken',
	new FacebookTokenStrategy(
		{
			clientID: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
			fbGraphVersion: 'v3.0',
			passReqToCallback: true,
		},
		async (req, accessToken, refreshToken, profile, done) => {
			try {
				//Could get accessed in 2 ways:
				// 1. When registering for 1st time
				// 2. When linking account to existing one

				if (req.user) {
					//Check if aldready linked account
					const facebookStrPos = req.user.methods.indexOf('facebook');
					if (facebookStrPos >= 0) {
						//done('You have aldready linked your google account',null)
						throw new Error('You have aldready linked your facebook account');
					}

					//Aldready logged in,need to link account
					//Add facebook's data to an existing account
					req.user.methods.push('facebook');
					req.user.facebook = {
						id: profile.id,
						email: profile.emails[0].value,
					};
					await req.user.save();
					done(null, req.user);
				} else {
					//In account creation process

					//CHECK WHETHER THIS USER EXISTS IN OUR DB
					let existingUser = await User.findOne({ 'facebook.id': profile.id });
					if (existingUser) {
						return done(null, existingUser);
					}

					//Check if we have someone with the same email
					existingUser = await User.findOne({ 'local.email': profile.emails[0].value });
					if (existingUser) {
						//We need to merge facebook's data with local auth
						existingUser.methods.push('facebook');
						existingUser.facebook = {
							id: profile.id,
							email: profile.emails[0].value,
						};
						await existingUser.save();
						return done(null, existingUser);
					}

					//IF NEW ACCOUNT
					const newUser = new User({
						methods: ['facebook'],
						username: profile.emails[0].value.split('@')[0],
						email: profile.emails[0].value,
						profilePic: profile.photos[0].value,
						facebook: {
							id: profile.id,
							email: profile.emails[0].value,
						},
					});
					req.user = newUser;
					await newUser.save();
					done(null, newUser);
				}
			} catch (err) {
				done(err, false, err.message);
			}
		}
	)
);
