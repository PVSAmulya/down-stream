const {
	PlanetsParams
} = require('./planets.model');
const logger = require('../default/default.logger');
const internalServerError = 'Technical Error. Please try again later'

class PlanetsMiddleware {
	/**
	 * validates user params with respect to PlanetsParams model
	 * @method module:Planets~PlanetsMiddleware.validateUserParams
	 * @param {Object} req express req object required to get requested user params
	 * @param {Object} res express res object required to send response
	 * @param {Object} next to call next middleware
	 */
	static validateUserParams(req, res, next) {
		try {
			req.params.id = req.params && parseInt(req.params.id)
			const params = new PlanetsParams(req.params);
			req.params = params;
			next();
		} catch (err) {
			/** if the exception when creating new object in first line occurs, given values are invalid, so send custom message to user */
            logger.error('Error while validating user params in sending planets and residents species data', __filename, '.validateUserParams()', err, 'critical');
			return res.send({
				error: true,
				message: internalServerError
			});
		}
	}
}
module.exports = PlanetsMiddleware;