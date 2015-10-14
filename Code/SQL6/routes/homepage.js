var express = require('express');
var fs = require('fs');
var router = express.Router();
var mysql = require('mysql');


//Type in your connection to mysql here
var connectionCredentials = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sql6'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage', {});
});

module.exports = router;
