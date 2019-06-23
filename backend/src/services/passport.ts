import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import * as passportLocal from 'passport-local';
import * as dotenv from 'dotenv';
import * as passport from 'passport';
import * as bcrypt from 'bcrypt';
import User from '../models/User';

// initialize env variables
dotenv.config();

// create local strategy
const LocalStrategy = passportLocal.Strategy;
const localOptions = { usernameField: 'email', passwordField: 'password' };
const localLogin = new LocalStrategy(localOptions, async (email: string, password: string, done: any) => {
	// verify this username and password, call done with the user..
	// if it is the correct email and password
	// otherwise, call done with false
	try {
		const user: any = await User.findOne({ email: email.toLowerCase() }).exec();
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (passwordMatch) {
			return done(null, user);
		} else {
			return done('Incorrect email and/or password');
		}
	} catch (error) {
		console.log('passport error', error);
		return done('Invalid email');
	}
});

// setup options for JWT strategy
const jwtOptions = {
	// tell passport to get the token from authorization header with Bearer prefix
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SECRET
};

// create the JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(jwtPayload, done) {
	// check if token has expired, else return payload
	if (Date.now() > jwtPayload.expires) {
		return done('Token expired');
	}
	return done(null, jwtPayload);
});

// Instruct passport to use the strategies
passport.use(localLogin);
passport.use(jwtLogin);
