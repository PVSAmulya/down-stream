const swapi = require('swapi-node');
const nconf = require('nconf');
const hostPrefix = nconf.get('links:hostPrefix');
const host = nconf.get('swapi:host');

class SwapiService {
    constructor() {}

    /**
     * method calls swapi api and return the respective data
     * @param {string} route swapi route/complete url to call the Swapi API end point
     * @param {boolean} isFullRoute if the route is complete url then value will be true
     */
    static get(route, isFullRoute) {
        const url = (isFullRoute) ? route : host + hostPrefix + route;
        return swapi.get(url);
    }
}

module.exports = SwapiService;