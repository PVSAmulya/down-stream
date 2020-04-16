const {
	Model,
	Field
} = require('./default.model');

/**
 * @constant PromisePathValidator This is a internal function used for validating path field of PromiseRejectModel
 * @returns {boolean} It returns either true or false
 */
const PromisePathValidator = (param) => {
	if (param.includes('/') || param.includes('\\') && param.endsWith('()')) {
		return true;
	} else {
		return false;
	}
};

/** @constant PromiseRejectRules to set data and rules for a data object used in Promise.reject*/
const PromiseRejectRules = [
	new Field('', 'message', true, ['string']),
	new Field('', 'sourcePath', true, ['string'], null, null, null, PromisePathValidator),
	new Field('', 'error', false, ['object', 'string']),
	new Field('', 'data', false, ['object'])
];

/**
 * @class module:Default.PromiseRejectModel
 * @classdesc sets rules for Promise rejection case
 * @example
 *    Promise.reject(new PromiseRejectMode(message,sourcePath,error,data))
 * @param {object} params contains fields to which rules need to be set
 * @param {boolean} fromDatabase boolean to be set true if params are from database else false
 */
class PromiseRejectModel extends Model {
	constructor(params) {
		super();
		this.setRulesValues(PromiseRejectRules, params, false);
	}
}

module.exports = {
	PromiseRejectModel
};