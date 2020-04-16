/**
 * @module server
 */
const http = require('http');
const express = require('express');
const app = express();
const nconf = require('nconf');
const logger = require('winston');
const packageJSON = require('./package.json');

nconf.file('app', 'config/app_config.json');
/* istanbul ignore if */
if (process.env.NODE_ENV !== 'TEST') {
	nconf.file('secret', 'config/.secret_config.json');
}
const Middleware = require('./modules/default/default.middleware');
const errorHandler = require('./modules/errors/error.middleware').errorHandler;

const routes = require('./routes');

/**
 * set the environment variables to nconf NODE_ENV in env becomes NODE:ENV
 * we need to specify what values we are using from env - security reasons
 */
nconf.env({
	separator: '_',
	whitelist: ['NODE_ENV']
});
/** Set default port number */
nconf.defaults({
	'http': {
		'port': 3000
	}
});
/** Initializing all default middleware in Middleware class - static method initialize */
Middleware.initialize(app);
/** Initializing routes file before error handler */
app.use('', routes);
/** if something goes wrong in any part of server, use this middleware to handle the error instead of crashing */
app.use(errorHandler);

const server = http.createServer(app);
/** listen to the given or default port */
server.listen(process.env.PORT || nconf.get('http:port'), function () {
	logger.info(
		`\n\n\t${packageJSON.description} Version: ${
			packageJSON.version
		}\n\tListening Port': ${nconf.get('http:port')}\n`
	);
});

/** export is required for test cases to run */
module.exports = {
	app
};