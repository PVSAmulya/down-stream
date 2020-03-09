/**
 * @constant {winston} winston logger used to log messages
 */
const logger = require('winston');
/**
 * @constant {nconf} nconf used to store all our config variables
 */
const nconf = require('nconf');
/**
 * @constant {CustomDate} CustomDate Class that has methods to custom date in particular required format
 */
const CustomDate = require('../helpers/custom_date');

/**
 * @class module:Default.Logger
 * @classdesc Logger class for logging various kinds of messages and errors
 * @desc This is a custom logger class we used throughout our project instead of console.log
 * @example
 * 		new Logger()
 */
class Logger {

	constructor() {
		this.LogError = LogError;
	}

	/**
	 * @method module:Default.Logger#info
	 * @desc message function to be called to log info message and to perform logics on info messages
	 * @param message message to log info message
	 * @example
	 *      new Logger().info()
	 */

	info(message) {
		if (nconf.get('logs:info')) {
			logger.info(message);
		}

	}

	/**
	 * @method module:Default.Logger#debug
	 * @desc message function to be called to log debugging message and to perform logics on debugging messages
	 * @param message message to log debugging message
	 *  @example
	 *      new Logger().debug()
	 */

	debug(message) {
		if (nconf.get('logs:debug')) {
			logger.debug(message);
		}
	}

	/**
	 * @method module:Default.Logger#warn
	 * @desc message function to be called to log warning message and to perform logics on warning messages
	 * @param message message to log warning message
	 *  @example
	 *      new Logger().warn()
	 */
	warn(message) {
		if (nconf.get('logs:warn')) {
			logger.warn(message);
		}
	}

	/**
	 * @method module:Default.Logger#error
	 * @desc error function to be called to log errors and to perform logics on error
	 * @param {string} message message to be sent as response.
	 * @param {string} file file name and function name of the place error occurred. EX: models/model_name/ModelName
	 * @param {string} desc description of the message. Contains error stack trace.
	 * @param {string} severity severity of the error. can be low/medium/critical.
	 * @example
	 *     new Logger().error(message,fileName,method,errDesc,severityType)
	 */

	error(message, fileName, method, errDesc, severityType) {
		if (nconf.get('logs:error')) {
			const error = new LogError(message, fileName + '.' + method, errDesc, severityType);
			if (error.validate()) {
				//4 - number of space characters for white space
				logger.error(JSON.stringify(error, null, 4));
			} else {
				logger.error(error.validationMessage()); //Logs Error
				throw new Error(error.validationMessage()); //Sends response to request instead of request timeout
			}
		}
	}
}

/**
 * @class module:Default.LogError
 * @inner
 * @classdesc Error Model class for initializing and configuring error and caught exceptions
 * @desc Model of a Error is defined in this class. Object needed to be created to this class in order to log the errors.
 * @param {string} message message to be sent as response.
 * @param {string} file file name and function name of the place error occurred. EX: models/model_name/ModelName
 * @param {string} desc description of the message. Contains error stack trace.
 * @param {string} severity severity of the error. can be low/medium/critical.
 */

class LogError {
	/**
	 * @constructor
	 * @inner
	 * @classdesc Error Model class for initializing and configuring error and caught exceptions
	 * @desc Model of a Error is defined in this class. Object needed to be created to this class in order to log the errors.
	 * @param {string} message message to be sent as response.
	 * @param {string} file file name and function name of the place error occurred. EX: models/model_name/ModelName
	 * @param {string} desc description of the message. Contains error stack trace.
	 * @param {string} severity severity of the error. can be low/medium/critical.
	 * @example
	 *      new LogError()
	 */
	constructor(message, file, desc, severity) {
		this.errorTime = new CustomDate().getLoggerFormat();
		this.message = message;
		this.file = file;
		this.severity = severity;
		this.server = 'Web-server';
		this.validationMsg = 'success';
		this.desc = '';
		if (desc) {
			if (desc.message) {
				this.desc += ' <========> Message: ' + desc.message;
			}
			if (desc.stack) {
				this.desc += ' <========> Stack: ' + desc.stack;
			}
			if (JSON.stringify(desc) && JSON.stringify(desc) !== '{}') {
				this.desc += ' <========> JSON.stringify():' + JSON.stringify(desc);
			}
			if (desc.toString()) {
				this.desc += ' <========> Err.toString(): ' + desc.toString();
			}
			if (Object.entries(desc).length === 0) {
				this.desc += ' <=========> Empty Object in Description';
			}
		} else {
			this.desc = 'No Error Description.';
		}
	}

	/**
	 * @method module:Default.LogError#validate
	 * @desc validate the params in logger.error() to make sure we are passing all the required parameters
	 * @example
	 *     new LogError().validate()
	 */
	validate() {
		if (!this.message || !this.file || !this.desc || !this.severity) {
			this.validationMsg = 'Error must be instance of LogError class (Default/default.logger.js). for error with message: ' + this.message + ',file: ' + this.file + ' ,desc: ' + this.desc + ' ,severity: ' + this.severity;
			return false;
		} else if (this.severity !== 'low' && this.severity !== 'medium' && this.severity !== 'critical') {
			this.validationMsg = 'Severity must be either low or medium or critical. But, received ' + this.severity + '.';
			return false;
		}
		return true;
	}

	/**
	 * @method module:Default.LogError#validateMessage
	 * @desc this returns the validationMsg
	 */
	validationMessage() {
		return this.validationMsg;
	}
}

module.exports = new Logger();