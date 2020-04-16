const router = require('express').Router();
const DefaultResponse = require('../default/default.response');
const planetsMiddleWare = require('./planets.middleware');
const PlanetsController = require('./planets.controller');
const planetsControllerObject = new PlanetsController();

router.get('/:id',
    (req, res, next) => planetsMiddleWare.validateUserParams(req, new DefaultResponse(req, res, next), next),
    (req, res, next) => planetsControllerObject.getData(req.params, new DefaultResponse(req, res, next), next));

module.exports = router;