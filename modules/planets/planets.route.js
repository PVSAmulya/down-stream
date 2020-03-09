const router = require('express').Router();
const planetsMiddleWare = require('./planets.middleware');
const PlanetsController = require('./planets.controller');
const planetsControllerObject = new PlanetsController();

/**
 * Route to validate user params and send planets data
 */
router.get('/:id',
    (req, res, next) => planetsMiddleWare.validateUserParams(req, res, next),
    (req, res, next) => planetsControllerObject.getData(req.params, res, next));

module.exports = router;