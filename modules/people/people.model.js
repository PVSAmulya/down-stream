/** @constant {Model} Model is a parent class used to import the default params */
/** @constant {Field} Field is a model class to set rules for request and response params */
const {
    Model,
    Field
} = require('../default/default.model');

const peopleParamFields = [
    new Field('id', 'id', true, 'number'),
];

class PeopleParams extends Model {
    constructor(params, fromDatabase) {
        super();
        this.setRulesValues(peopleParamFields, params, fromDatabase);
    }
}

const peopleResponseFields = [
    new Field('firstName', 'first_name', true, 'string'),
    new Field('lastName', 'last_name', false, 'string'),
    new Field('species', 'species', false, 'string'),
];

class PeopleResponseData extends Model {
    constructor(params, fromDatabase) {
        super();
        this.setRulesValues(peopleResponseFields, params, fromDatabase);
    }
}

module.exports = {
    PeopleParams,
    PeopleResponseData
};