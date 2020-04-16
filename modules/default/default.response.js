/**@constant {Logger} logger requires Logger class from default module's default.logger file */
const logger = require('./default.logger');
/**@constant {Model} DefaultModel requires Default class from default module's default.model file */
const {
	Model
} = require('./default.model');

/**
 * @class module:Default.DefaultResponse
 * @classdesc validates the response text before sending to frontend
 * if the format is incorrect - throws an error that has to be handled whenever this class is used
 * @desc get the response object
 * @param {Object} res express response Object
 * @param {Object} res express response object or null/undefined
 * @param {Object} next express next object or null/undefined
 */
class DefaultResponse {
	constructor(req, res, next) {
		// in case only response was sent from the from end
		if (!res && !next) {
			this.response = req;
		} else {
			this.request = req;
			this.response = res || req;
			this.next = next;
		}
		// creating an Error() object to throw insufficient Arguments when sending a response
		this.error = new Error();
		this.error.name = 'insufficientArguments';
		this.error.message = 'insufficient arguments passed to create object for Error and Message are required to send a response';
		this.error.userMessage = 'Technical Error. Please try again later.';

	}

	/**
	 * @method module:Default.DefaultResponse#send
	 * @desc similar to express response object send - actually calls internally after validating the response format
	 * @param {Response} response Response object that contains data to send to frontend, if invalid throws an error
	 * @example
	 * // res is express response object passed from router function
	 * new DefaultResponse(res).send(error: false, message: '', data: [])
	 */
	send(error, message, data = []) {
		try {

			/** response.headersSent is a boolean value that indicates whether the headers have already been sent to the client */
			if (!this.response.headersSent) {
				/** if the object is a response object, send the response, else reject the response - developer issue */
				if (this.validate(error, message, data)) {
					this.response.send({
						error,
						message,
						data: data.map((element) => element.getValues())
					});
				} else {
					/** if the send method doesn't have enough arguments then it will send a error Message and throws error -- developer responsibility to must send {error,message,data} */
					throw this.error;
				}
			} else {
				/** if the express().response.send() is already used before using the send(error,message,data=[]) then headerSent is set to true, in that case we log error - response is send more than once */
				logger.error('response data = ' + (data + '').substr(0, 200), 'DefaultResponse', 'send()', 'response.send called more than once', 'medium');
			}
		} catch (err) {
			/** when above code throws error then we are logging the error */
			logger.error('Exception calling response.send() data = ' + (data + '').substr(0, 200), 'DefaultResponse', 'send()', err.name + '__' + err.message + '__' + err.userMessage, 'critical');
			if (this.response && !this.response.headersSent) {
				return this.response.send({
					error: true,
					message: this.error.userMessage
				});
			}
		}
	}

	/**
	 * @method module:Default.DefaultResponse#json
	 * @desc similar to express response object json - actually calls internally after validating the response format
	 * @param {Response} response Response object that contains data to send to frontend, if invalid throws an error
	 * @example
	 * 		new DefaultResponse(res).json(error: false, message: '', data: [])
	 */
	json(error, message, data = []) {
		try {
			if (!this.response.headersSent) {
				/** if the object is a response object, send the response, else reject the response - developer issue */
				if (this.validate(error, message, data)) {
					this.response.json({
						error,
						message,
						data: data.map((element) => element.getValues())
					});
				} else {
					throw this.error;
				}
			} else {
				logger.error('response data = ' + (data + '').substr(0, 200), 'DefaultResponse', 'send()', 'response.send called more than once', 'medium');
			}
		} catch (err) {
			logger.error('Exception calling response.send() data = ' + (data + '').substr(0, 200), 'DefaultResponse', 'send()', err.name + '__' + err.message + '__' + err.userMessage, 'critical');
			if (this.response && !this.response.headersSent) {
				return this.response.json({
					error: true,
					message: this.error.userMessage
				});
			}
		}
	}

	/**
	 * @method module:Default.DefaultResponse#end
	 * @desc similar to express response object end - Ends response session
	 * @example
	 * // res is express response object passed from router function
	 * new DefaultResponse(res).end();
	 */
	end() {
		this.response.end();
	}


	/**
	 * @method module:responses~DefaultResponse#unauthorizedUser
	 * @desc throws error for error_handler to catch which invalidates current user session and sends `invalid user` response
	 * Can be customized to send custom message and saveToken as it accepts both parameters as arguments
	 * @example
	 *     new DefaultResponse(res).unauthorizedUser(message,saveToken);
	 * // res is express response object passed from router function
	 * new Response(res).unauthorizedUser('Invalid User', 'invalidToken')
	 * @param {String} message custom message to send to frontend that is displayed to user.. default message is sent
	 * @param {String} saveToken saveToken is invalidUser that lets frontend to perform operation accordingly
	 */
	unauthorizedUser(message = 'Invalid user! Please login again', saveToken = 'InvalidToken') {
		if (this.next) {
			this.next({
				status: 401,
				message,
				saveToken
			});
		} else {
			/** if the object is a response object, send the response, else reject the response - developer issue */
			throw new Error({
				status: 401,
				message,
				saveToken
			});
		}
	}

	/**
	 * @method module:Default.DefaultResponse#internalServerError
	 * @desc throws error for error_handler to catch which throws error to catch by error handler which in further sends the technical error response
	 * @param {String} message custom message to send to frontend that is displayed to user.. default message is sent
	 * @example
	 * // res is express response object passed from router function
	 * new DefaultResponse(res).internalServerError(message,submessage);
	 */
	internalServerError(message = 'Technical error. Please try again later', status = 500) {
		/** if the object is a response object, send the response, else reject the response - developer issue */
		if (this.next) {
			this.next({
				status: status,
				message
			});
		} else {
			/** if the object is a response object, send the response, else reject the response - developer issue */
			// this.response.header('SaveToken', 'TechnicalError');
			throw new Error({
				status: status,
				message
			});
		}
	}

	/**
	 * @method module:Default.DefaultResponse#validate
	 * @desc throws error if the response we are sending doesn't have {error:boolean,message:string,data[]:Default Instance type}
	 * @param {String} message custom message to send to frontend that is displayed to user.. default message is sent
	 * @param {boolean} error error is true or false indicating that will be useful for front end developers from backend response object
	 * @param {Array<module:Default.Model>} data this consists of the object of  key-values that needs to be send to front end
	 * @example
	 * // res is express response object passed from router function
	 * new DefaultResponse(res).validate(error,message,data);
	 */
	validate(error, message, data) {
		if (typeof error !== 'boolean') {
			return false;
		}
		if (error && !message) {
			return false;
		}
		try {
			data.forEach(element => {
				if (!(typeof element === 'object' && element instanceof Model)) {
					throw new Error('Data Object is not model object');
				}
			});
		} catch (error) {
			logger.error('Data should be an array of model class or should have empty value in response', 'DefaultResponse', 'validate()', error.message || error, 'critical');
			return false;
		}
		return true;
	}
}

module.exports = DefaultResponse;