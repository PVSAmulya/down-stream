const router = require('express').Router();
const peopleMiddleWare = require('./people.middleware');
const PeopleController = require('./people.controller');
const peopleControllerObject = new PeopleController();

/**
 * Route to validate user params and  send people data
 */
router.get('/:id',
(req, res, next) => peopleMiddleWare.validateUserParams(req, res, next),
(req, res, next) => peopleControllerObject.getData(req.params, res, next));

module.exports = router;