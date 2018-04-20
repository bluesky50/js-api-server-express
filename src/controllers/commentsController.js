const { STATUS_OK } = require('../configs/statusCodes');
const { handleInvalidInput, handleServerError } = require('../helpers/responseHandlers');
const { validateInput, validateStringInput, validateMongoId } = require('../helpers/validation');

const Comment = require('../models/Comment');
const serverConfig = require('../configs/serverConfig');

let commentValidationSchema = {
	user: 'id',
	post: 'id',
	content: 'string'
};;


function dynamicValidationSchema(schema) {
	if (process.env.ENV === 'test' || serverConfig.env === 'test') {
		return {
			_id: 'id',
			...schema
		};
	}
	return schema;
}

function getComments(req, res) {
	Comment.find()
		// .populate('user', 'username')
		// .populate('post', 'title')
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

function getComment(req, res) {
	const id = req.params.id;
	if (validateMongoId(id)) {
		Comment.findById(id)
			// .populate('user', 'username')
			// .populate('post', 'title')
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

function createComment(req, res) {
	if (validateInput(req.body, dynamicValidationSchema(commentValidationSchema))) {
		const newComment = new Comment(req.body);
		newComment.save()
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

function updateComment(req, res) {
	const id = req.params.id;
	const updateObj = req.body;

	if (validateMongoId(id) && validateInput(updateObj, commentValidationSchema)) {
		Comment.findByIdAndUpdate(id, updateObj, { new: true })
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

function deleteComment(req, res) {
	const id = req.params.id;

	if(validateMongoId(id)) {
		Comment.findByIdAndRemove(id)
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
	getComments,
	getComment,
	createComment,
	updateComment,
	deleteComment
}