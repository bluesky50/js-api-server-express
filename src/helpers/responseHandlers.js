const { STATUS_SERVER_ERROR, STATUS_UNPROCESSABLE_ENTITY } = require('../configs/statusCodes');

function handleInvalidInput(res) {
	res.status(STATUS_UNPROCESSABLE_ENTITY);
	res.json({ status: STATUS_UNPROCESSABLE_ENTITY, message: 'Invalid input' });
}

function handleServerError(res, err) {
	res.status(STATUS_SERVER_ERROR);
	res.json({ status: STATUS_SERVER_ERROR, message: err.message });
}

module.exports = {
	handleInvalidInput,
	handleServerError
}