/** @constant {Model} Model is a parent class for Menu used to import it default params */
/** @constant {Field} Field is a model class to set rules for request and response params */
const {
    Model,
    Field
} = require('../default/default.model');

const planetsParamFields = [
    new Field('id', 'id', true, 'number'),
];

class PlanetsParams extends Model {
    constructor(params, fromDatabase) {
        super();
        this.setRulesValues(planetsParamFields, params, fromDatabase);
    }
}

const planetsResponseFields = [
    new Field('speciesName', 'name', true, 'string'),
    new Field('speciesCount', 'count', false, 'object', null, null, {}),
];

class PlanetsResponseData extends Model {
    constructor(params, fromDatabase) {
        super();
        this.setRulesValues(planetsResponseFields, params, fromDatabase);
    }
}

module.exports = {
    PlanetsParams,
    PlanetsResponseData
};