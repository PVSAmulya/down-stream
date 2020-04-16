const DefaultController = require('../default/default.controller');
const swapiService = require('../services/swapi.service');
const {
    PeopleResponseData
} = require('./people.model');
const {
    PromiseRejectModel
} = require('../default/promise.reject.model');
const sharedService = require('../services/shared.service');

class PeopleController extends DefaultController {
    constructor() {
        super();
    }

    getData(params, response) {
        const route = '/people/' + params.id + '/';
        let fullName, speciesUrl;
        let firstName, lastName, species;
        return swapiService.get(route).then((peoplesList) => {
                fullName = peoplesList.name;
                speciesUrl = peoplesList.species.toString();
                return this.getFirstAndLastName(fullName);
            })
            .then(fullName => {
                firstName = fullName.firstName;
                lastName = fullName.lastName;
                return sharedService.getSpecies(speciesUrl);
            })
            .then((speciesList) => {
                species = speciesList.name;
                const resData = {
                    firstName: firstName,
                    lastName: lastName,
                    species: species
                };
                const userRes = [];
                userRes.push(new PeopleResponseData(resData, true));
                return response.json(false, '', userRes);
            })
            .catch(err => {
                this.logger.error(err);
                return response.internalServerError();
            });
    }

    getFirstAndLastName(fullName) {
        try {
            if (!fullName || !fullName.length) {
                throw new Error(new PromiseRejectModel({
                    message: data.message,
                    sourcePath: __filename + 'requestData()',
                    data: data
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
                message: data.message,
                sourcePath: __filename + 'requestData()',
                data: data
            }));
        }

    }
}

module.exports = PeopleController;