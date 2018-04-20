const { STATUS_OK } = require('../configs/statusCodes');
const { handleInvalidInput, handleServerError } = require('../helpers/responseHandlers');
const { validateInput, validateStringInput, validateMongoId } = require('../helpers/validation');

const User = require('../models/User');

const serverConfig = require('../configs/serverConfig');

let userValidationSchema = {
	username: 'string',
	email: 'string',
	about: 'string'
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


function getUsers(req, res) {
	User.find()
		.then((data) => {
			res.status(STATUS_OK);
			const status = res.statusCode;
			res.json({ status, data });
		})
		.catch((err) => {
			handleServerError(res, err);
		});
}

function getUser(req, res) {
	const id = req.params.id;
	if (validateMongoId(id)) {
		User.findById(id)
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

function createUser(req, res) {
	if (validateInput(req.body, dynamicValidationSchema(userValidationSchema))) {
		const newUser = new User(req.body);
		newUser.save()
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

function updateUser(req, res) {
	const id = req.params.id;
	const updateObj = req.body;

	if (validateMongoId(id) && validateInput(updateObj, userValidationSchema)) {
		User.findByIdAndUpdate(id, updateObj, { new: true })
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

function deleteUser(req, res) {
	const id = req.params.id;

	if(validateMongoId(id)) {
		User.findByIdAndRemove(id)
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
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser
}