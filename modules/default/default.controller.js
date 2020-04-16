/**
 * @module Default
 */

/**
 * @constant {Logger} logger Default custom logger used to log all info/debug/error/warn messages
 */
const logger = require('./default.logger');
/**
 * @class module:Default.DefaultController
 * @desc Constructor requires filename as parameter, initializes the common members across the extended classes. Also, does common operations for all controllers
 * @example
 *   new DefaultController()
 * @param {string} filename - filename needs to be passed as string when invoking this object.We will use this when extending this default controller to specific controller - we specify filename in that specific controller's constructor
 * @classdesc All the default methods and the common attributes that can be used in more than one controller can be placed here. All the default objects needed for all other controllers  are initialized in this default controller such as logger(),database connection
 */

class DefaultController {
	/**
	 * @constructs DefaultController
	 * @param {object} logger Default.logger object
	 * @param {object} databaseConnection DatabaseConnection object
	 */
	constructor() {
		this.logger = logger;
	}
}

module.exports = DefaultController;