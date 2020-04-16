const DefaultController = require('../default/default.controller');
const swapiService = require('../services/swapi.service');
const sharedService = require('../services/shared.service');
const {
    PlanetsResponseData
} = require('./planets.model');

class PlanetsController extends DefaultController {
    constructor() {
        super();
        this.species = {};
    }

    getData(params, response) {
        this.species = {};
        const route = '/planets/' + params.id + '/';
        let name;
        return swapiService.get(route).then((result) => {
                name = result.name;
                return this.getSpecies(result.residents);
            })
            .then(species => {
                const speciesCount = species;
                const resData = {
                    speciesName: name,
                    speciesCount: speciesCount
                };
                const userRes = [];
                userRes.push(new PlanetsResponseData(resData, true));
                return response.json(false, '', userRes);
            })
            .catch(err => {
                this.logger.error(err);
                return response.internalServerError();
            });
    }

    getSpecies(residents) {
        return residents.reduce((previousPromise, resident) => {
            return previousPromise
                .then(() => {
                    return this.retrieveSpecies(resident);
                });
        }, Promise.resolve());

    }

    retrieveSpecies(resident) {
        return swapiService.get(resident.toString(), true)
            .then(residentList => {
                return sharedService.getSpecies(residentList.species.toString(), true);
            })
            .then(speciesList => {
                const speciesName = speciesList.name;
                this.species[speciesName] = this.species[speciesName] ? this.species[speciesName] + 1 : 1;
                return this.species;
            });
    }
}

module.exports = PlanetsController;