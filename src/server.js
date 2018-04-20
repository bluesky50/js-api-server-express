require('./configs/processConfig');

const debug = require('debug')('js-api-server:server');
const http = require('http');
const mongoose = require('mongoose');
const serverConfig = require('./configs/serverConfig');
const app = require('./app');

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || serverConfig.defaultPort);
// app.set('port', port);

/**
 * Connect to database
 */
connectToDb(process.env.DB_URI);

/**
 * Start server.
 */
const server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);

server.listen(port);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
	const port = parseInt(val, 10);
	if (isNaN(port)) return val;
	if (port >= 0) return port;
	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	if (error.syscall !== 'listen') throw error;

	const bind = typeof(port) === 'string' ? 'Pipe ' + port : 'Port ' + port;
	switch(error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated priviledges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	const addr = server.address();
	const bind = `${serverConfig.host}:${serverConfig.defaultPort}`;
	// const bind = typeof(addr) === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	debug('Listening on ' + bind);
}

/**
 * Connection to database
 */
function connectToDb(uri) {
	mongoose.Promise = global.Promise;
	mongoose.connect 
	const connection = mongoose.connect(uri);
	debug(`Connected to ${uri}`);
}