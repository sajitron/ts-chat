import { connect } from 'mongoose';
import * as config from './index';

const { mongo_uri } = config.default;
const db: string = mongo_uri;

const connectDB = async () => {
	try {
		await connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false
		});

		console.log('Remote MongoDB connected...');
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

export default connectDB;
