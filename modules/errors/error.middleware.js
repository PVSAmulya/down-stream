/**
 * @module errors
 */

/** @constant {Logger} logger to log into console */
const logger = require('../default/default.logger');
const DefaultResponse = require('../default/default.response');
const nconf = require('nconf');

/**
 * @desc If the application encounters an error, this method is called to ensure the application doesn't stop and to send user friendly message to frontend
 * This function also handles the unknown routes with device friendly message (output format dependent on request platform)
 * @method module:errors#errorHandler
 * @param {Object} err error object from express framework that contains all the information (if error)
 * @param {Object} req express request object - not required but needed to access rest of the parameters
 * @param {Object} res express response object - required for sending response based on error/not found event
 * @param {Object} next next should be called after the headers are set to continue to next middleware/controller
 * 					next is used to let express framework know that we are handling the error and the express can now close the request (if err object is passed)
 */
const errorHandler = (err, req, res, next) => {
	let defaultResponse = new DefaultResponse(res);
	printError(req, err);
	/**
	 * if the headers were already sent i.e.., response is sent by some other middleware/controller
	 */
	if (res.headersSent) {
		return next(err);
	}
	/**
	 * set the error message if the development environment is enabled
	 */
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	/**
	 * if the error is NotFound - we need to send appropriate response based on request accepts parameter - html (preferred), json, else as text
	 */
	if (err === 'NotFound') {
		res.status(404);
		// respond with html page
		if (req.accepts('html')) {
			res.sendFile('404.html', {
				root: './views'
			});
			return;
		}

		// respond with json
		if (req.accepts('json')) {
			defaultResponse.json(true, 'Not Found');
			return;
		}

		// default to plain-text. send()
		res.type('txt').send('Not found');

	} else {
		/**
		 * if there is an error in the application, send user that something went wrong on our side
		 */
		if (err.status === 401) {
			res.header(nconf.get('headers:saveToken'), err.saveToken || 'InvalidToken');
			res.status(401);
			defaultResponse.json(true, err.message);
		} else if (err.status === 500) {
			res.status(err.status);
			defaultResponse.json(true, err.message);
			/* istanbul ignore if */
			if (nconf.get('env:curr') == 'dev' && process.env.NODE_ENV !== 'TEST') {
				process.exit();
			}
		} else {
			res.status(err.status || 500);
			defaultResponse.json(true, 'Technical error. Please try again later');
			/* istanbul ignore if */
			if (nconf.get('env:curr') == 'dev' && process.env.NODE_ENV !== 'TEST') {
				process.exit();
			}
		}

	}
};

const printError = (req, err) => {
	let warn = false;
	let errorInfo = 'UnHandled Error';
	if (err === 'NotFound') {
		warn = true;
		errorInfo = `404 - Not Found - ${req.originalUrl} - ${req.method} - ${req.ip}`;
	} else if (err && (err.status || err.message)) {
		warn = err.status === 401 || err.status === 404;
		errorInfo = `${err.status || 404} - ${err.message || 'Not Found'} - ${req.originalUrl} - ${req.method} - ${req.ip}`;
	}
	/**
	 * print the error message and send an email to developer if enabled in logger
	 */
	if (warn) {
		logger.warn(errorInfo);
	} else {
		logger.error(errorInfo, 'ErrorHandler', 'printError()', err, 'critical');
	}
};

module.exports = {
	errorHandler,
	printError
};