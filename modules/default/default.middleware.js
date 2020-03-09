/**
 * @constant {morgan} morgan Morgan used to log server messages
 */
const morgan = require('morgan');
/**
 * @constant {bodyParser} bodyparser Bodyparser used to convert the data into  json format from incoming express request
 */
const bodyParser = require('body-parser');
/**
 * @constant {cookieParser} cookieParser Cookie parser used to send cookies through response to front end
 */
const cookieParser = require('cookie-parser');
/**
 * @constant {path} path path is used to get current file path
 */
const path = require('path');
/**
 * @constant {winston} logger winston logger used to log messages
 */
const logger = require('winston');

/**
 * @constant {express} express Express framework used for smooth handling the request-response process in routes
 */
const express = require('express');
/**
 * @constant {nconf} nconf library to store the config variables
 */
const nconf = require('nconf');

/**
 * ========                             ================
 * ========    Do not modify this file  ================
 * ========                             ================
 * ========                             ================
 *
 * */


/**
 * @class module:Default.Middleware
 * @classdesc Default Middleware class has a static method that initializes express app with all basic Middleware required before handling request
 * @desc This class has default Middleware like cookieParser,cors,bodyParser,session etc
 */
class Middleware {
	/**
	 * @method module:Default.Middleware#initialize
	 * @param {object} app this is express() object
	 * @static
	 */
	static initialize(app) {
		/** use bodyParser middleware to allow incoming request body parsing in a middleware before handlers, available under the req.body property  */
		app.use(
			bodyParser.json({
				limit: '50mb'
			})
		);
		/** Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option */
		app.use(
			bodyParser.urlencoded({
				limit: '100mb',
				extended: true,
				parameterLimit: 100000
			})
		);

		/** Parse Cookie header and populate req.cookies with an object keyed by the cookie names */
		app.use(cookieParser());

		/** static path that routes to 404 page in views folder */
		app.use(express.static(path.join(__dirname, '../views')));

		/** HTTP request logger middleware for node.js. enables winston as default logger */
		app.use(
			morgan('combined', {
				stream: {
					write: message => logger.info(message)
				}
			})
		);

	}
}

/** export is required for test cases to run */
module.exports = Middleware;