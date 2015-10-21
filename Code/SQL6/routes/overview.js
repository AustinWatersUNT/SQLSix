var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
var connectionCredentials = require('./credentials');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('overview', {});
});

router.post('/statesData', function(req, res) {
  var content = fs.readFileSync("./json/stateData.json"); //Created JSON to have results load faster
  res.send(JSON.parse(content));
});

router.post('/topHotelsByBooking', function(req, res) {
  var query = req.body;

  //Create Query String
  var queryString = "SELECT b.PropertyId, p.name, COUNT(b.PropertyId) as Bookings " +
    "FROM sql6.booking as b " +
    "LEFT JOIN sql6.properties as p " +
    "on b.PropertyId = p.Id " +
    "GROUP BY b.PropertyId " +
    "ORDER BY Bookings desc " +
    "LIMIT 5;";

  var connection = mysql.createConnection(connectionCredentials);

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + connection.threadId);

    connection.query(queryString, function(err, rows, fields) {
      if (err) throw err;

      //Send the response back to the page
      res.send(rows);

    });

    connection.end();
  });
});

router.post('/topHotelsByCancellation', function(req, res) {
  var query = req.body;

  //Create Query String
  var queryString = "SELECT c.PropertyId, p.name, COUNT(c.PropertyId) as Cancellations " +
      "FROM sql6.cancel as c " +
      "LEFT JOIN sql6.properties as p " +
      "on c.PropertyId = p.Id " +
      "GROUP BY c.PropertyId " +
      "ORDER BY Cancellations desc " +
      "LIMIT 5;";

  var connection = mysql.createConnection(connectionCredentials);

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + connection.threadId);

    connection.query(queryString, function(err, rows, fields) {
      if (err) throw err;

      //Send the response back to the page
      res.send(rows);

    });

    connection.end();
  });
});

module.exports = router;
