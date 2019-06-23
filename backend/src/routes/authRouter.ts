import { Application, Request, Response } from 'express';
import { registerUser } from '../controllers/auth';

export default function authRouter(app: Application) {
	app.get('/auth/test', (_req: Request, res: Response) => {
		res.status(200).send('ALohA!!!');
	});

	app.post('/auth/register', registerUser);
}
