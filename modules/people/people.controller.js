/** @module People */
const DefaultController = require('../default/default.controller');
const {
    PeopleResponseData
} = require('./people.model');
const {
    PromiseRejectModel
} = require('../default/promise.reject.model');
const sharedService = require('../services/shared.service');
const internalServerError = 'Technical Error. Please try again later'

class PeopleController extends DefaultController {
    constructor() {
        super();
    }

    /**
     * GET /people/getData
     * getData method sends the request and fetches people list. from people list gets species url and get the species name
     * @method module:People~PeopleController#getData
     * @param {PeopleParams} params contains id. to fetch data from swapi.co api
     * @param {object} response contains first name, last name and species of the requested id
     */
    getData(params, response) {
        const route = '/people/' + params.id + '/';
        let fullName, speciesUrl;
        let species;
        return sharedService.getSwapi(route).then((peoplesList) => {
                fullName = peoplesList.name;
                speciesUrl = peoplesList.species.toString();
                if (speciesUrl) {
                    return sharedService.getSwapi(speciesUrl, true);
                }
            })
            .then(speciesList => {
                species = speciesList && speciesList.name;
                return this.getFirstAndLastName(fullName);
            })
            .then((fullName) => {
                const resData = {
                    firstName: fullName.firstName,
                    lastName: fullName.lastName,
                    species: species
                };
                const userRes = [];
                userRes.push(new PeopleResponseData(resData, true));
                return response.send({
                    first_name: userRes[0].first_name,
                    last_name: userRes[0].last_name,
                    species: userRes[0].species
                });
            })
            .catch(err => {
                if (err.message === '404') {
                    return response.send({
                        message: "No people exists for the given id. Please try again with different id"
                    });
                }
                if (err instanceof PromiseRejectModel && err.error || err instanceof Error) {
                    this.logger.error('Error while sending people and species data', __filename, '.getData()', err, 'critical');
                }
                return response.send({
                    message: err.message || internalServerError
                });
            });
    }

    /**
     * method formats full name to firstName and lastName and returns the respective data
     * @param {string} fullName contains first name, middle name and last name
     */
    getFirstAndLastName(fullName) {
        try {
            if (!fullName || !fullName.length) {
                throw new Error(new PromiseRejectModel({
                    message: internalServerError,
                    sourcePath: __filename + 'requestData()',
                    error: 'fullName is empty'
                }));
            } else {
                const nameArr = fullName.split(' ');
                let firstName = nameArr[0];
                let lastName = (nameArr.length > 1) ? nameArr[nameArr.length - 1] : undefined;
                return {
                    firstName: firstName,
                    lastName: lastName
                };
            }
        } catch (err) {
            throw new Error(new PromiseRejectModel({
                message: internalServerError,
                sourcePath: __filename + 'requestData()',
                error: err
            }));
        }
    }
}

module.exports = PeopleController;