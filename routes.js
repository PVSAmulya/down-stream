const express = require('express')();
const error = require('./modules/errors/error.route');
const people = require('./modules/people/people.route');
const planets = require('./modules/planets/planets.route');

express.use('/people', people);
express.use('/planets', planets);

express.use(error);

module.exports = express;