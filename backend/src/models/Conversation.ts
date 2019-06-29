import { model, Schema, SchemaTypes, Document } from 'mongoose';

interface ConversationDocument extends Document {
  partyOne: string;
  partyTwo: string;
  messages: [{
    user: string,
    text: string,
    created_at: Date
  }],
  created: Date;
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
  messages: [{
    user: SchemaTypes.ObjectId,
    text: SchemaTypes.String,
    created_at: SchemaTypes.Date
  }],
  created: {
    type: SchemaTypes.Date,
    default: Date.now()
  }
})

export default model<ConversationDocument>('Conversation', ConversationSchema)