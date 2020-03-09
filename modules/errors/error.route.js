/** @constant {Router} router express router object to export error handler for all other routes */
const router = require('express').Router();
/**
 * @name get/* post/*
 * @function
 * @memberof module:errors
 * @inner
 * @param {string} path - Express path
 * @throws NotFound error - any path that does not have valid route declared in routes file, will eventually match this route and throws an error which is handled by error middleware
 */
router.use('*', () => {
	throw 'NotFound';
});

module.exports = router;