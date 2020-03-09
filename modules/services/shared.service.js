const swapiService = require('../services/swapi.service');

class SharedService {
    constructor() {}

    /**
     * call swapi service method
     * @param {string} url swapi route/complete url to call the Swapi API end point
     * @param {boolean} isFullRoute is the url is complete url then value will be true
     */
    static getSwapi(url, isFullRoute) {
        return swapiService.get(url, isFullRoute);
    }
}

module.exports = SharedService;