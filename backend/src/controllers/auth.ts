import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import User from '../models/User';
import * as config from '../config';

const { secret } = config.default;

export function registerUser(req: Request, res: Response, _next: NextFunction) {
	const { email, password, firstName, lastName, userName } = req.body;

	if (!email || !password) return res.status(422).send({ error: 'You must provide an email and a password' });

	// check password length
	if (password.length < 7) return res.status(422).send({ error: 'Password must be a minimum of 7 characters' });

	// check if user with same email exists
	User.findOne({ email }, (err, userExists) => {
		if (err) return res.status(422).send(err);

		// if a user with the email exists, return an error
		if (userExists) return res.status(422).send({ error: 'Email already taken' });

		// create new user if email is not taken
		const user = new User({
			firstName,
			lastName,
			email,
			password,
			userName
		});

		user.save((err) => {
			if (err) return res.status(422).send({ error: err.message });

			const payload = {
				email: user.email,
				expires: '100d'
			};

			// generate a signed token and return in the response
			const token = jwt.sign(JSON.stringify(payload), secret);

			// asign our jwt to the cookie
			// res.cookie('jwt', token, { httpOnly: true, secure: true });

			// respond to request indicating user was created
			res.json({ user, token });
		});
	});
}

export function loginUser(req: Request, res: Response, next: NextFunction) {
	passport.authenticate('local', { session: false }, (error: Error, user: any) => {
		if (error || !user) {
			return next({ error: 'Invalid email and/or password' });
		}

		// setup jwt payload
		const payload = {
			email: user.email,
			expires: '100d'
		};

		// assign payload to req.user
		req.login(payload, { session: false }, (error: Error) => {
			if (error) {
				return next(error);
			}

			User.findOne({ email: user.email }, function(err: Error, userObject: any) {
				if (err) {
					return next({ error: 'Error getting user' });
				}

				if (!userObject) {
					return next({ error: 'User does not exist' });
				}

				// generate a signed token and return in the response
				const token = jwt.sign(JSON.stringify(payload), secret);

				res.status(200).send({ user, token });
			});
		});
	})(req, res, next);
}
