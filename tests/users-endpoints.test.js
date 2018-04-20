process.env.NODE_ENV = 'test';
process.env.ENV = 'test';

const app = require('../src/app.js');
const request = require('supertest');
const mongoose = require('mongoose');

const serverConfig = require('../src/configs/serverConfig');
const statusCodes = require('../src/configs/statusCodes');
const User = require('../src/models/User');

mongoose.connect(`${serverConfig.dbUri}-test`);

const ROUTE = '/users';
const SLUG = '/:id';
const SINGLE_ROUTE = `${ROUTE}${SLUG}`;
const GET_OBJECTS_TEST_DESCRIPTION = `GET ${ROUTE}`;
const GET_OBJECT_TEST_DESCRIPTION = `GET ${SINGLE_ROUTE}`;
const POST_OBJECT_TEST_DESCRIPTION = `POST ${ROUTE}`;
const PUT_OBJECT_TEST_DESCRIPTION = `PUT ${SINGLE_ROUTE}`;
const DELETE_OBJECT_TEST_DESCRIPTION = `DELETE ${SINGLE_ROUTE}`;

const firstObjectId = new mongoose.Types.ObjectId().toHexString();

const objectsArray = [
	{
		_id: firstObjectId,
		username: "jsmith",
		email: "jsmith@me.com",
		about: "jsmith's profile",
	}, {
		_id: new mongoose.Types.ObjectId().toHexString(),
		username: "dwilson",
		email: "dwilson@me.com",
		about: "dwilson's profile",
	}, {
		_id: new mongoose.Types.ObjectId().toHexString(),
		username: "wjohnson",
		email: "wjohnson@me.com",
		about: "wjohnson's profile",
	}
];

const newObject = {
	_id: new mongoose.Types.ObjectId().toHexString(),
	username: "bdavidson",
	email: "bdavidson@me.com",
	about: "bdavidson's profile",
};

const updateObject = {
	username: "jsmith",
	email: "jsmith@newEmail.com",
	about: "jsmith's new profile"
}

//TODO: Implement tests for invalid request body objects.
describe('Test the endpoints for /users', () => {

	// beforeAll(() => {});
	beforeEach((done) => {
		User.remove({})
			.then(() => {
				return User.insertMany(objectsArray);
			})
			.then(() => {
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	// afterEach((done) => {
	// 	User.remove({})
	// 		.then(() => {
	// 			done();
	// 		})
	// 		.catch((err) => {
	// 			done(err);
	// 		});
	// });

	describe(`${GET_OBJECTS_TEST_DESCRIPTION}`, () => {

		test('Server response should be multiple objects in an array', (done) => {
			return request(app).get(ROUTE)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(statusCodes.STATUS_OK);
					expect(Array.isArray(data)).toBe(true);
					expect(data.length).toBe(objectsArray.length);
					expect(data).toEqual(objectsArray);
					done();
				});
		});
	});

	describe(`${GET_OBJECT_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).get(`${ROUTE}/${firstObjectId}`)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(statusCodes.STATUS_OK);
					expect(data).toEqual(objectsArray[0]);
					done();
				});
		});
	});

	describe(`${POST_OBJECT_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).post(ROUTE)
				.send(newObject)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(statusCodes.STATUS_OK);
					expect(data).toEqual(newObject);
					done();
				});
		});

		test('Server response should be a single object', (done) => {
			return request(app).post(ROUTE)
				.send(newObject)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(statusCodes.STATUS_OK);
					expect(data).toEqual(newObject);

					return request(app).get(`${ROUTE}/${newObject._id}`)
						.then((r) => {
							const data2 = r.body.data;
							expect(r.statusCode).toBe(statusCodes.STATUS_OK);
							expect(data2).toEqual(newObject);
							done();
						});
				});
		});

		test('Server response should be multiple objects in an array', (done) => {
			return request(app).post(ROUTE)
				.send(newObject)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(statusCodes.STATUS_OK);
					expect(data).toEqual(newObject);

					return request(app).get(ROUTE)
						.then((r) => {
							const data2 = r.body.data;
							expect(r.statusCode).toBe(statusCodes.STATUS_OK);
							expect(Array.isArray(data2)).toBe(true);
							expect(data2.length).toBe(objectsArray.length + 1);
							expect(data2).toEqual(objectsArray.concat([newObject]));
							done();
						});
			});
		});
	});

	describe(`${PUT_OBJECT_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).put(`${ROUTE}/${firstObjectId}`)
				.send(updateObject)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(statusCodes.STATUS_OK);
					expect(data).toEqual({...updateObject, _id: firstObjectId});
					done();
				});
		});

		test('Server response should be multiple objects in an array', (done) => {
			return request(app).put(`${ROUTE}/${firstObjectId}`)
				.send(updateObject)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(statusCodes.STATUS_OK);
					expect(data).toEqual({...updateObject, _id: firstObjectId});
					
					return request(app).get(`${ROUTE}/${firstObjectId}`)
						.then((r) => {

							const data2 = r.body.data;
							expect(r.statusCode).toBe(statusCodes.STATUS_OK);
							expect(data2).toEqual({ ...objectsArray[0], ...updateObject });
							done();

							// Testing for all the objects to match.
							// Actually only need to test if that one object was updated.
							// const data2 = r.body.data;
							// expect(r.statusCode).toBe(statusCodes.STATUS_OK);

							// const comparisonArray = [...objectsArray];
							// comparisonArray[0] = {...objectsArray[0], ...updateObject};
							// expect(data2).toEqual(comparisonArray);
							// done();
						});
					});
		});
	});

	describe(`${DELETE_OBJECT_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).delete(`${ROUTE}/${firstObjectId}`)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(statusCodes.STATUS_OK);
					expect(data).toEqual(objectsArray[0]);
					done();
				});
		});
		test(`Server response should be multiple objects in an array`, (done) => {
			return request(app).delete(`${ROUTE}/${firstObjectId}`)
			.then((res) => {
				const data = res.body.data;
				expect(res.statusCode).toBe(statusCodes.STATUS_OK);
				expect(data).toEqual(objectsArray[0]);
				
				return request(app).get(ROUTE)
					.then((r) => {
						const data2 = r.body.data;
						expect(r.statusCode).toBe(statusCodes.STATUS_OK);
						expect(Array.isArray(data2)).toBe(true);

						const comparisonArray = objectsArray.slice(1);
						expect(data2.length).toBe(comparisonArray.length);
						expect(data2).toEqual(comparisonArray);
						done();
					});
			});
		})
	});
});