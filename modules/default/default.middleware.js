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
 * @constant {express-session} session session is used to maintain user session since http is stateless
 */
const session = require('express-session');
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
		/** enable CORS capability to express server */
		// app.use(this.enableCORS);
		/** creating express session as middleware with options related to cookie*/
		app.use(
			session({
				secret: 'Super Secret Session Key',
				saveUninitialized: true,
				resave: true
			})
		);
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

	/**
	 * @method module:Default.Middleware#enableCORS
	 * @param {object} req Request object in express() object
	 * @param {object} res Response object in express() object
	 * @param {object} next next function that calls the next middleware in the queue
	 * @static
	 */
	// static enableCORS(req, res, next) {
	// 	if (nconf.get('env:curr') === 'dev') {
	// 		res.setHeader('Access-Control-Allow-Origin', '*');
	// 	} else {
	// 		const allowedOrigins = nconf.get('cors:origin');
	// 		const origin = req.headers.origin;
	// 		if (allowedOrigins.indexOf(origin) > -1) {
	// 			res.setHeader('Access-Control-Allow-Origin', origin);
	// 		}
	// 	}
	// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	// 	// header names are getting from the config file
	// 	res.setHeader('Access-Control-Allow-Headers', 'origin, Content-Type, authorization,');
	// 	res.setHeader('Access-Control-Allow-Credentials', true);
	// 	/**
	// 	 * The Cache-Control general-header field is used to specify directives for caching mechanisms in both requests and responses.
	// 	 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
	// 	 */
	// 	res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
	// 	next();
	// }
}

/** export is required for test cases to run */
module.exports = Middleware;