import { Application } from 'express';
import { createConvo, getUserConvos } from '../controllers/convo';
import { requireAuth } from './authRouter';

export default function convoRouter(app: Application) {
	app.post('/conversation', requireAuth, createConvo);

	app.get('/conversation/:userid', requireAuth, getUserConvos);
}
