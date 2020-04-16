const {	PeopleParams } = require('./people.model');
const logger = require('../default/default.logger');

class PeopleMiddleware {
	static validateUserParams(req, res, next) {
		try {
			req.params.id = req.params && parseInt(req.params.id)
			const params = new PeopleParams(req.params);
			req.params = params;
			next();
		} catch (err) {
			/** if the exception when creating new object in first line occurs, given values are invalid, so send custom message to user */
            logger.error('TODO', __filename, 'validateUserParams()', err, 'critical');
            // todo
			return res.unauthorizedUser(defaultMessage);
		}
	}
}
module.exports = PeopleMiddleware;