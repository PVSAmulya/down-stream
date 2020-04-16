const swapi = require('swapi-node');
const nconf = require('nconf');
const hostPrefix = nconf.get('links:hostPrefix');
const host = nconf.get('swapi:host');

class SwapiService {
    constructor() {}

    static get(route, isFullRoute) {
        const url = (isFullRoute) ? route : host + hostPrefix + route;
        return swapi.get(url);
    }
}

module.exports = SwapiService;