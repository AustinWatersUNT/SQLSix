var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connectionCredentials = require('./credentials');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('quiz', {});
});

module.exports = router;
