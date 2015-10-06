var express = require('express');
var fs = require('fs');
var router = express.Router();
var mysql = require('mysql');

var connectionCredentials = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sql6'
};

/* GET home page. */
router.get('/', function(req, res, next) {

  var connection = mysql.createConnection(connectionCredentials);

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + connection.threadId);

    connection.query('SELECT * FROM customers', function(err, rows, fields) {
      if (err) throw err;
      var customers = rows;

      connection.query("SELECT DISTINCT Country FROM properties", function(err, rows, fields) {
        if (err) throw err;
        res.render('homepage', {
          customers: customers,
          countries:rows
        });
        connection.end();
      });
    });
  });
});

router.post('/hotelsByLocation', function(req, res) {
  console.log(req.body);
  var query = req.body;

  var queryString = "SELECT * FROM properties";
  if(query.State != '' || query.City != '') queryString = queryString + " WHERE";

  if(query.State != '' && query.City != '') queryString = queryString + " State='" + query.State + "' &&  City='" + query.City + "'";
  else if(query.State != '') queryString = queryString + " State='" + query.State + "'";
  else if(query.City != '')queryString = queryString + " City='" + query.City + "'";

  var connection = mysql.createConnection(connectionCredentials);

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + connection.threadId);

    connection.query(queryString, function(err, rows, fields) {
      if (err) throw err;

      res.send(rows);

    });

    connection.end();
    });
});

router.post('/citiesByState', function(req, res) {
  var query = req.body;

  var queryString = "SELECT DISTINCT City FROM properties WHERE State='" + query.State + "' && Country='" + query.Country + "'";

  var connection = mysql.createConnection(connectionCredentials);

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + connection.threadId);

    connection.query(queryString, function(err, rows, fields) {
      if (err) throw err;

      res.send(rows);

    });

    connection.end();
  });
});

router.post('/statesByCountry', function(req, res) {
  var query = req.body;

  var queryString = "SELECT DISTINCT State FROM properties WHERE Country='" + query.Country + "'";

  var connection = mysql.createConnection(connectionCredentials);

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + connection.threadId);

    connection.query(queryString, function(err, rows, fields) {
      if (err) throw err;

      res.send(rows);

    });

    connection.end();
  });
});


module.exports = router;
