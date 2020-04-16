const logger = require('winston');

/**
 * @class module:Default.Model
 * @classdesc Default Model Class for initializing and configuring common attributes to all the models
 * Rules are defined in this class along with validation function to validate object.
 * Rules need to be initialized by derived class to use validate function
 * @desc it's not possible to create object as this is default model which alone cannot be used
 */
class Model {
	/**
	 * @method module:Default.Model#setRulesValues
	 * @desc set the rules for validation
	 * @param {Array<module:Default.Field>} fields is an array of Fields objects, used for validating members that are only defined in this fields
	 * if multiple types are included, please include Default extended class to be first element in array (only one class validation for now)
	 */
	setRulesValues(fields, params, fromDatabase) {
		this.rules = this.rules ? this.rules.concat(fields) : fields;
		/** if boolean value is false, do not allowing default value */
		if (params) {
			this.rules.forEach(rule => {
				/** getting the paramKey based on the fromDatabase - we use this paramKey to find its corresponding value in given params array  */
				const paramKey = fromDatabase ? rule.databaseName : rule.name;
				/** making the type wrap in a array type */
				const type = Array.isArray(rule.type) ? rule.type : [rule.type];
				/** handling the case if the type provided is of Default instance type */
				if (params[paramKey] && type[0].prototype instanceof Model) {
					this[rule.name] = (Array.isArray(params[paramKey]) ? params[paramKey] : [params[paramKey]]).map(val => new type[0](val, fromDatabase));
				}
				/** handling the case if the type provided is of boolean type  */
				else if (type.indexOf('boolean') > -1 && params[paramKey] !== null && params[paramKey] != undefined) {
					this[rule.name] = !!(params[paramKey]);
				} else {
					/** default case - getting the key and corresponding value and binding it to this object */
					this[rule.name] = (params[paramKey] !== undefined && params[paramKey] !== null) ? params[paramKey] : rule.defaultValue;
				}
			});
		}
		if (!this.skipValidation) {
			this.validateFields();
		}
	}

	/**
	 * @method module:Default.Model#validateFields
	 * @desc Allows us to validate any field in the model using the generic rules that allow us to send error message if any of tests fail
	 */
	validateFields() {
		if (!this.rules || this.rules.length === 0) {
			return false;
		}
		const invalidMessage = this.rules.reduce((isInvalid, element) => {
			if (isInvalid)
				return isInvalid;
			/** checking whether the field required is set to true if so, does it have null or undefined instead of value */
			if (element.required && (this[element.name] === null || this[element.name] === undefined))
				return element.name + ' is required';
			/** field is not required then we allow null or undefined to store, so we are skipping further validation by using return statement */
			else if (!this[element.name])
				return false;
			/** getting the type value from the current element */
			const typeValue = (Array.isArray(this[element.name]) ? this[element.name] : [this[element.name]]);
			/** Checking whether the element type is instance of Default */
			if ((element.type[0] || element.type).prototype instanceof Model) {
				typeValue.forEach(val => {
					isInvalid = isInvalid ? isInvalid : val.validateFields();
				});
			} else {
				/** checking whether the typeof(element's value) is same as the value specified in type in that Field */
				typeValue.forEach(val => {
					if (element.type && element.type.indexOf(typeof val) === -1)
						isInvalid = element.name + ' requires ' + element.type + ' but ' + typeof this[element.name] + ' provided';
				});
			}
			if (isInvalid) {
				return isInvalid;
			}
			/** validating if there is custom validator function provided in the element's Field attribute */
			if (element.customValidator && !element.customValidator(this[element.name]))
				return element.name + ' is invalid';
			/** validating based on the element's min and max value specified in the current Field in rules Param */
			if ((element.minimumValue !== null && element.minimumValue !== undefined) && this.length(this[element.name]) < element.minimumValue) {
				return element.name + ' requires a minimum of ' + element.minimumValue + ' but ' + this.length(this[element.name]) + ' provided';
			} else if ((element.maximumValue !== null && element.maximumValue !== undefined) && this.length(this[element.name]) > element.maximumValue) {
				return element.name + ' cannot exceed ' + element.maximumValue + ' but ' + this.length(this[element.name]) + ' provided';
			}
			return isInvalid;
		}, false);
		/** After all validations if there is some value in invalid message then throw validation error */
		if (invalidMessage) {
			logger.warn('validation failed for model ' + this.constructor.name + ' with message ' + invalidMessage);
			throw new Error('validation failed for model ' + this.constructor.name + ' with message ' + invalidMessage);
		}
	}

	/**
	 * @method module:Default.Model#length
	 * @desc returns number of characters for a string, same number for number
	 * @param {any} value value can be of any datatype or undefined
	 */
	length(value) {
		if (typeof value === 'string')
			return value.length;
		if (typeof value === 'number')
			return value;
		if (typeof value === 'boolean')
			return 1;
		return value;

	}
	/**
	 * @method module:Default.Model#getValues
	 * @desc returns just the data from the object with key value pairs by excluding rules array from the object
	 * @param {Array} rules This is an array of the Field class objects that specify the validation constraints for each field value
	 * @param {bool} isDatabase This is a boolean value specified as parameter, so that we can know whether to look for value with databaseName key or name key
	 */
	getValues(rules = this.rules || [], isDatabase = false) {
		return (rules).reduce((prev, element) => {
			const key = isDatabase ? element.databaseName : element.name;
			try {
				/** checking whether the element is type of Default Instance then we are further going inside each field and get the nested object values */
				if (this[element.name] instanceof Model) {
					prev[key] = isDatabase ? this[element.name].getDatabaseValues() : this[element.name].getValues();
					return prev;
					/** checking whether element is a type array that consists of the Default instances values */
				} else if (Array.isArray(this[element.name]) && this[element.name][0] instanceof Model) {
					prev[key] = this[element.name].map(val => isDatabase ? val.getDatabaseValues() : val.getValues());

					return prev;
				}
			} catch (err) {
				/** eslint command - don't alter following line */
				/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
			}
			/** assigning the key value pairs from the this object array */
			prev[key] = this[element.name];
			return prev;
		}, {}) || {};
	}
	/**
	 * @method module:Default.Model#getDatabaseValues
	 * @desc returns just the data from the object with key value pairs by excluding rules array from the object, we use this method to
	 * @param {Array} rules This is an array of the Field class objects that specify the validation constraints for each field value
	 */
	getDatabaseValues(rules = this.rules || []) {
		return this.getValues(rules.filter(rule => rule.databaseName !== '_id' && rule.databaseName), true);
	}
}
/**
 * @class module:Default.Field
 * @classdesc class for defining validation/custom rules for class members in models
 * @desc name cannot be empty, if empty there might be an error thrown in validation function
 */
class Field {
	/**
	 * @constructor
	 * @param {string} dbName database name of the field, use to retrieve using this key if fromDatabase in setRulesMethod of Default class set to true
	 * @param {string} name name of the field, used to retrieve value and forming the error message]
	 * @param {boolean} required if the value is required or optional, if optional - validations are skipped if the value is not available
	 * @param {string} type datatype of the value, if it is not same, error is returned
	 * @param {number} minimumValue minimum number of characters in the value
	 * @param {number} maximumValue maximum number of characters in the value
	 * @param {Function} customValidator allows custom validation function that is called for validating the data, e.g.., email validation for username
	 */
	constructor(dbName, name, required, type, minimumValue, maximumValue, defaultValue, customValidator) {
		this.databaseName = dbName;
		this.name = name;
		this.required = required;
		this.type = type;
		this.minimumValue = minimumValue;
		this.maximumValue = maximumValue;
		this.defaultValue = defaultValue;
		this.customValidator = customValidator;
	}
}

module.exports = {
	Field,
	Model
};