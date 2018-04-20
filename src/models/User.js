const validator = require('validator');

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minLength: 6
	},
	email: {
		type: String,
		requied: true,
		unique: true,
		minLength: 1,
		validate: {
			isAsync: true,
			validator: validator.isEmail,
			message: '${VALUE} is not a valid email'
		}
	},
	about: {
		type: String,
		required: false,
		default: ''
	}
}, { versionKey: false });

const User = mongoose.model('User', UserSchema);

module.exports = User;