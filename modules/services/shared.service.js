const swapiService = require('../services/swapi.service');

class SharedService {
    constructor() {}
    static getSpecies(speciesUrl) {
        return swapiService.get(speciesUrl, true);
    }
}

module.exports = SharedService;