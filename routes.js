
const router = require('express').Router();
const nconf = require('nconf');
const error = require('./modules/errors/error.route');
const people = require('./modules/people/people.route');
const planets = require('./modules/planets/planets.route');

const apiUrl = nconf.get('links:apiPrefix');

router.use(apiUrl + '/people', people);
router.use(apiUrl + '/planets', planets);

router.use(error);

module.exports = router;