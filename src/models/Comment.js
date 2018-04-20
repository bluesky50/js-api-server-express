const validator = require('validator');

const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		requied: true,
		ref: 'Post'
	},
	content: {
		type: String,
		required: true,
		minLength: 1,
		maxLength: 360
	}
}, { versionKey: false });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;