/** @module Planets */
const DefaultController = require('../default/default.controller');
/** contains getSwapi method which calls swapi api with the provided url */
const sharedService = require('../services/shared.service');
const {
    PlanetsResponseData
} = require('./planets.model');
const internalServerError = 'Technical Error. Please try again later';

/** 
 * @extends module:Default~DefaultController which contains logger to log errors, warnings
 */
class PlanetsController extends DefaultController {
    constructor() {
        super();
        /** variable to store response species name and count. gets updated on each planets resident/people call */
        this.species = {};
    }

    /**
     * GET /planets/getData
     * @method module:Planets~PlanetsController#getData
     * @param {PlanetsParams} params contains id. to fetch from swapi.co api
     * @param {object} response contains name equal to respective planet name and count which represents the total count of the residents/people in the planet
     */
    getData(params, response) {
        this.species = {};
        const route = '/planets/' + params.id + '/';
        let name;
        return sharedService.getSwapi(route).then((result) => {
                name = result.name;
                if (result.residents && result.residents.length) {
                    return this.getSpecies(result.residents);
                }
            })
            .then(species => {
                const speciesCount = species;
                const resData = {
                    speciesName: name,
                    speciesCount: speciesCount
                };
                const userRes = [];
                userRes.push(new PlanetsResponseData(resData, true));
                return response.send({
                    name: userRes[0].name,
                    count: userRes[0].count
                });
            })
            .catch(err => {
                this.logger.error('Error while sending planets and residents species data', __filename, '.getData()', err, 'critical');
                if (err.message === '404') {
                    return response.send({
                        message: "No people exists for the given id. Please try again with different id"
                    });
                }
                if ((err instanceof PromiseRejectModel && err.error) || err instanceof Error) {
                    this.logger.error('Error while sending planets and residents species data', __filename, '.getData()', err, 'critical');
                }
                return response.send({
                    message: err.message || internalServerError
                });
            });
    }

    /**
     * @method module:Planets~PlanetsController#getSpecies
     * getSpecies method sequentially resolves the promises to get the count of species
     * @param {array} residents contains the list of people urls
     */
    getSpecies(residents) {
        return residents.reduce((previousPromise, resident) => {
            return previousPromise
                .then(() => {
                    return this.retrieveSpecies(resident);
                });
        }, Promise.resolve());
    }

    /**
     * @method module:Planets~PlanetsController#retrieveSpecies
     * retrieveSpecies method retrieves species url and species name and make a count of each species in this.species object
     * @param {array} resident people url to fetch species and url and then fetch the type of species
     */
    retrieveSpecies(resident) {
        return sharedService.getSwapi(resident.toString(), true)
            .then(residentList => {
                if (residentList.species.length) {
                    return sharedService.getSwapi(residentList.species.toString(), true);
                }
            })
            .then(speciesList => {
                const speciesName = speciesList && speciesList.name;
                if (speciesName) {
                    this.species[speciesName] = this.species[speciesName] ? this.species[speciesName] + 1 : 1;
                }
                return this.species;
            });
    }
}

module.exports = PlanetsController;