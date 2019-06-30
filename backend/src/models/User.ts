import { model, Schema, SchemaTypes, Document } from 'mongoose';
import { NextFunction } from 'express';
import * as validator from 'validator';
import { pick } from 'lodash';
import * as bcrypt from 'bcrypt';

interface UserDocument extends Document {
	firstName: string;
	lastName: string;
	userName: string;
	email: string;
	password: string;
	created_at: Date;
	updated_at: Date;
}

const UserSchema = new Schema({
	firstName: {
		type: SchemaTypes.String,
		required: true
	},
	lastName: {
		type: SchemaTypes.String,
		required: true
	},
	userName: {
		type: SchemaTypes.String,
		required: true,
		unique: true,
		minlength: 5
	},
	email: {
		type: SchemaTypes.String,
		required: true,
		unique: true,
		minlength: 6,
		validate: {
			validator: validator.isEmail,
			msg: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: SchemaTypes.String,
		required: true,
		minlength: 7
	},
	created_at: {
		type: SchemaTypes.Date,
		default: Date.now()
	},
	updated_at: {
		type: SchemaTypes.Date,
		default: Date.now()
	}
});

// return only specific properties when returning user object

UserSchema.methods.toJSON = function() {
	let user = this;
	let userObject = user.toObject();

	return pick(userObject, [ '_id', 'email', 'userName' ]);
};

// hash password before saving
UserSchema.pre<UserDocument>('save', function(next: NextFunction) {
	const user = this;

	// generate a salt and run the callback
	bcrypt.genSalt(10, function(err: any, salt: string) {
		if (err) return next(err);

		// encrypt the password using the salt
		bcrypt.hash(user.password, salt, function(err: any, hash: string) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

export default model<UserDocument>('User', UserSchema);
