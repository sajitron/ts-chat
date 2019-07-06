import { model, Schema, SchemaTypes, Document } from 'mongoose';

interface ConversationDocument extends Document {
	partyOne: string;
	partyTwo: string;
	messages: [
		{
			sender: string;
			text: string;
			created_at: Date | number;
		}
	];
	created: Date | number;
}

const ConversationSchema = new Schema({
	partyOne: {
		type: SchemaTypes.ObjectId,
		required: true
	},
	partyTwo: {
		type: SchemaTypes.ObjectId,
		required: true
	},
	messages: [
		{
			sender: SchemaTypes.ObjectId,
			text: SchemaTypes.String,
			created_at: SchemaTypes.Date
		}
	],
	created: {
		type: SchemaTypes.Date,
		default: Date.now()
	}
});

export default model<ConversationDocument>('Conversation', ConversationSchema);
