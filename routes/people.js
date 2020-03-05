var express = require('express');
var router = express.Router();

/* GET /people/:id */
router.get('/:id', function(req, res, next) {
  res.send('enter resource here');
});

module.exports = router;
