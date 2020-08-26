var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.end("This is testbot-1's property, proceed with caution!");
});

module.exports = router;
