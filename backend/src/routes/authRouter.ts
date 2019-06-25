import { Application, Request, Response } from 'express';
import * as passport from 'passport';
import { registerUser, loginUser } from '../controllers/auth';
require('../services/passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const verifyUser = passport.authenticate('local', { session: false });

export default function authRouter(app: Application) {
	app.get('/auth/test', (_req: Request, res: Response) => {
		res.status(200).send('ALohA!!!');
	});

	app.post('/auth/register', registerUser);

	app.post('/auth/login', verifyUser, loginUser);

	app.get('/hello', requireAuth, (req: Request, res: Response) => {
		res.status(200).send("Successfully authenticated! Woop Woop!")
	})
}
