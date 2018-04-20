const { STATUS_OK } = require('../configs/statusCodes');
const { handleInvalidInput, handleServerError } = require('../helpers/responseHandlers');
const { validateInput, validateStringInput, validateMongoId } = require('../helpers/validation');

const Post = require('../models/Post');

const serverConfig = require('../configs/serverConfig');

let postValidationSchema = {
	author: 'id',
	title: 'string',
	content: 'string'
};

function dynamicValidationSchema(schema) {
	if (process.env.ENV === 'test' || serverConfig.env === 'test') {
		return {
			_id: 'id',
			...schema
		};
	}
	return schema;
}

function getPosts(req, res) {
	Post.find()
		// .populate('author', 'username')
		// .exec()
		.then((data) => {
			res.status(STATUS_OK);
			const status = res.statusCode;
			res.json({ status, data });
		})
		.catch((err) => {
			handleServerError(res, err);
		});
}

function getPost(req, res) {
	const id = req.params.id;
	if (validateMongoId(id)) {
		Post.findById(id)
			// .populate('author', 'username')
			// .exec()
			.then((data) => {
				res.status(STATUS_OK);
				const status = res.statusCode;
				res.json({ status, data });
			})
			.catch((err) => {
				handleServerError(res, err);
			});
			return;
	} else {
		handleInvalidInput(res);
	}
}

function createPost(req, res) {
	if (validateInput(req.body, dynamicValidationSchema(postValidationSchema))) {
		const newPost = new Post(req.body);
		newPost.save()
			.then((data) => {
				res.status(STATUS_OK);
				const status = res.statusCode;
				res.send({ status, data });
			})
			.catch((err) => {
				handleServerError(res, err);
			});
		return;
	} else {
		handleInvalidInput(res);
	}
}

function updatePost(req, res) {
	const id = req.params.id;
	const updateObj = req.body;

	if (validateMongoId(id) && validateInput(updateObj, postValidationSchema)) {
		Post.findByIdAndUpdate(id, updateObj, { new: true })
			.exec()
			.then((data) => {
				res.status(STATUS_OK);
				const status = res.statusCode;
				res.json({ status, data });
			})
			.catch((err) => {
				handleServerError(res, err);
			});
		return;
	} else {
		handleInvalidInput(res);
	}
}

function deletePost(req, res) {
	const id = req.params.id;

	if(validateMongoId(id)) {
		Post.findByIdAndRemove(id)
			.exec()
			.then((data) => {
				res.status(STATUS_OK);
				const status = res.statusCode;
				res.json({ status, data });
			})
			.catch((err) => {
				handleServerError(res, err);
			});
		return;
	} else {
		handleInvalidInput(res);
	}
}

module.exports = {
	getPosts,
	getPost,
	createPost,
	updatePost,
	deletePost
}