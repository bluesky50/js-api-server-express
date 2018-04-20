const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const createError = require('http-errors');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

/** 
 * Import routers
 */
const postsRouter = require('./routers/postsRouter');
const commentsRouter = require('./routers/commentsRouter');
const usersRouter = require('./routers/usersRouter');

/**
 * Initialize an express server 
 */
const app = express();

/**
 * Configure server middleware
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
if (app.get('env') !== 'test') app.use(logger('dev'));
app.use(helmet());
app.use(cors());

/**
 * Configure server to accept requests from Cross Origin Resources
 * for dev environment testing purposes.
 * Creates open public api for REST endpoints.
 */
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});

/**
 * Configuring the GET '/' route for the server.
 */
app.get('/', (req, res) => {
	const fileURL = path.join(__dirname, 'public', 'index.html');

	res.writeHead(200, { "Content-Type": "text/html" });
	
	fs.readFile(fileUrl, function(err, data) {
		if (err) throw err;
		res.send(data);
	});
});

/**
 * Configuring the GET and POST '/test' route for the server.
 * Send back the post body to the client.
 */
app.route('/test')
	.get((req, res) => {
		const status = res.statusCode;
		res.json({ status, data: 'Hello world!' });
	})
	.post((req, res) => {
		const echo = req.body;
		const status = res.statusCode;
		res.json({ status, data: echo});
	});

/**
 * Configure the /posts routes for the server.
 */
app.use('/posts', postsRouter);

/**
 * Configure the /comments routes for the server.
 */
app.use('/comments', commentsRouter);

/**
 * Configure the /users routes for the server.
 */
app.use('/users', usersRouter);

/**
 * Configure server to handle errors
 */
app.use(function(req, res, next) {
	next(createError(404));
});

app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	// res.locals.message = err.message;
	// res.locals.error = req.app.get('env') === 'development' ? err : {};

	if (req.app.get('env') === 'development') {
		res.writeHead(err.status || 500, { "Content-Type": "text/html" });
		res.write(`<p>Server Error ${err.status}</p>`);
		// res.write('<pre>');
		res.write(`<p>${err.message}<p>`);
		// res.write('</pre>');
		res.end();
		return;
	}
	next();
});

module.exports = app;
  