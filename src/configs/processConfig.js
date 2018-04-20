const serverConfig = require('./serverConfig');

const env = process.env.NODE_ENV || serverConfig.env;

const processConfig = {
	'PORT': serverConfig.defaultPort,
	'DB_URI': serverConfig.dbUri,
}

if (env === 'test' || env === 'dev') {
	Object.keys(processConfig).forEach((k) => {
		process.env[k] = processConfig[k];
	});
}