const mongoose = require('mongoose');

function validateInput(inputObj, schema) {
	if (typeof(inputObj) !== 'object' || typeof(schema) !== 'object') {
		// console.log(typeof(inputObj));
		// console.log(typeof(schema));
		// console.log('Input or schema is not an object');
		return false;
	}

	const schemaKeys = Object.keys(schema);
	const inputObjKeys = Object.keys(inputObj);

	// check if the objects have the right number of properties.
	if (schemaKeys.length !== inputObjKeys.length) {
		// console.log('Failed keys length check');
		return false;
	}

	// Check if each object property.
	for (let key of schemaKeys) {
		const index = inputObjKeys.indexOf(key);
		
		// check if property exists
		if (index === -1) {
			// console.log('Failed property check');
			return false
		}

		// Check if the value is of the right type at that key.
		if (schema[key] === 'array') {
			if (!Array.isArray(inputObj[key])) {
				// console.log('Invalid array property');
				return false
			}
		} else if (schema[key] === 'id') {
			if(!validateMongoId(inputObj[key])) {
				// console.log('Invalid id property');
				return false;
			}
		} else {
			if (typeof(inputObj[key]) !== schema[key]) {
				// console.log('Invalid property');
				return false;
			}
		}

		// Remove key from array.
		inputObjKeys.splice(index, 1);
	}

	// just a final check if inputObj has additional properties not listed on the schema.
	if(inputObjKeys.length > 0) {
		// console.log('Failed remaining keys check');
		return false;
	}

	return true;
}

function validateStringInput(value) {
	if (value === undefined || value === null) return false;
	if (value && typeof(value) === 'string') return true;
	return false;
}

function validateArrayInput(value) {
	return Array.isArray(value);
}

function validateObjectInput(value) {
	if (value === undefined || value === null) return false;
	if (typeof(value) === 'object') return true;
	return false;
}

function validateNumberInput(value) {
	if (value === undefined) return false;
	if (typeof(value) === 'number') return true;
	return false;
}

function validateMongoId(value) {
	if (!value || value === undefined || value === null) return false;
	return mongoose.Types.ObjectId.isValid(value);
}

function testAll(...args) {
	const func = argumnents[0];

	for (let i = 1; i < arguments.length; i++) {
		if (!func(values[i])) return false;
	}

	return true;
}

module.exports = {
	validateInput,
	validateStringInput,
	validateArrayInput,
	validateNumberInput,
	validateObjectInput,
	validateMongoId,
	testAll
}