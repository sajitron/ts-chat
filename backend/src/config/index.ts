import * as dotenv from 'dotenv';

dotenv.config();

export default {
	mongo_uri: process.env.MONGO_URI,
	secret: process.env.SECRET
};
