const router = require('express').Router();
const DefaultResponse = require('../default/default.response');
const peopleMiddleWare = require('./people.middleware');
const PeopleController = require('./people.controller');
const peopleControllerObject = new PeopleController();

router.get('/:id',
(req, res, next) => peopleMiddleWare.validateUserParams(req, new DefaultResponse(req, res, next), next),
(req, res, next) => peopleControllerObject.getData(req.params, new DefaultResponse(req, res, next), next));

module.exports = router;