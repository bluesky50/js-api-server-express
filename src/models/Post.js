const validator = require('validator');

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		maxLength: 100,
		minLength: 3
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		requied: true,
		ref: 'User'
	},
	content: {
		type: String,
		required: true,
		maxLength: 1000,
		minLength: 1
	}
}, { versionKey: false });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;