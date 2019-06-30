import { Request, Response, NextFunction } from 'express';
import Conversation from '../models/Conversation';

export function createConvo(req: Request, res: Response, next: NextFunction) {
	const { partyOne, partyTwo, sender, text } = req.body;

	// * check if all required participant IDs are present
	if (!partyOne || !partyTwo || !sender) res.status(422).send('One or more parties missing');

	// * check if a conversation between both participants already exists;
	Conversation.findOne({ partyOne, partyTwo }, (err: Error, convo: any) => {
		if (err) return next(err);

		// * if conversation history exists, push new message into messages array
		if (convo) {
			convo.messages.push({ sender, text, created_at: Date.now() });

			return convo.save((err: Error) => {
				if (err) return res.status(422).send({ error: err.message });

				return res.json(convo);
			});
		} else {
			// * if no convo history exists, create new conversation
			const conversation = new Conversation();

			conversation.partyOne = partyOne;
			conversation.partyTwo = partyTwo;
			conversation.messages = [ { sender, text, created_at: Date.now() } ];
			conversation.created = Date.now();

			return conversation.save((err: Error) => {
				if (err) return res.status(422).send({ error: err.message });

				return res.json(conversation);
			});
		}
	});
}
