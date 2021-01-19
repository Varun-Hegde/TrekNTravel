const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy

const User = require('./models/userModel')

const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies){
        token = req.cookies.access_token
    }
    return token
}


//JWT STRATEGY
//CAN BE USED TO CHECK WHEHER A USER IS SIGNED IN OR NOT
passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWTSecret,
    passReqToCallback: true
}, async (req,payload,done) => {
    try{
        const user = await User.findById(payload.sub);
        if(!user){
            return done(null,false)
        }
        req.user = user
        done(null,user)
    }catch( error){
        done(error,false);
    }
}))

//LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email,password,done) => {
    try{
        const user = await User.findOne({email})
        if(!user) {
            return done(null,false)
        }
        const isMatch = await user.isValidPassword(password);
        if(!isMatch){
            return done(null,false);
        }
        done(null,user);
    }catch(err){
        done(err,false);
    }
}))



