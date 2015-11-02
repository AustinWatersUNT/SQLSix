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

    var queryString = "SELECT b.State, b.Booking, c.Cancellations FROM " +
    "(Select p.State, COUNT(b.Id) as Booking FROM sql6.booking as b " +
    "LEFT JOIN sql6.properties as p on p.Id = b.PropertyId " +
    "GROUP BY p.State) as b " +
    "LEFT JOIN " +
    "(Select p.State, COUNT(c.Id) as Cancellations FROM sql6.cancel as c " +
    "LEFT JOIN sql6.properties as p on p.Id = c.PropertyId " +
    "GROUP BY p.State) as c on b.State = c.State";

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

router.post('/byInDate', function(req, res) {
  var query = req.body;

  //Create Query String
  var queryString = "SELECT b.book_count, c.cancel_count, s.search_count, b.InDate " +
      "FROM (SELECT Count(*) as book_count, InDate From sql6.booking " +
      "WHERE InDate < '01-01-2016' " +
      "GROUP BY InDate) as b " +
      "LEFT JOIN (SELECT Count(*) as cancel_count, InDate FROM sql6.cancel " +
      "GROUP BY InDate) as c " +
      "on b.InDate = c.InDate " +
      "LEFT JOIN (SELECT Count(*) as search_count, InDate FROM sql6.search " +
      "WHERE InDate > '07-13-2015' " + "GROUP BY InDate) as s on b.InDate = s.InDate;";

    var content = fs.readFileSync("./json/byDate.json"); //Created JSON to have results load faster
    res.send(JSON.parse(content));

});

router.post('/byOutDate', function(req, res) {
    var queryString = "SELECT b.book_count, c.cancel_count, s.search_count, b.OutDate " +
        "FROM (SELECT Count(*) as book_count, OutDate From sql6.booking " +
        "WHERE OutDate < '2016-01-01' " +
        "GROUP BY OutDate) as b " +
        "LEFT JOIN (SELECT Count(*) as cancel_count, OutDate FROM sql6.cancel " +
        "GROUP BY OutDate) as c " +
        "on b.OutDate = c.OutDate " +
        "LEFT JOIN (SELECT Count(*) as search_count, OutDate FROM sql6.search " +
        "WHERE OutDate > '07-13-2015' " +
        "GROUP BY OutDate) as s on b.OutDate = s.OutDate;";

    var content = fs.readFileSync("./json/byOutDate.json"); //Created JSON to have results load faster
    res.send(JSON.parse(content));

});

router.post('/customersbybooking', function(req, res) {
    var query = req.body;

    //Create Query String
    var queryString = "SELECT b.DestinationId, c.name, COUNT(b.DestinationId)  as Bookings, AVG(b.Rate) as Average " +
        "FROM sql6.booking as b " +
        "LEFT JOIN sql6.customers as c on b.DestinationId = c.Id " +
        "GROUP BY b.DestinationId " +
        "ORDER BY Bookings desc " +
        "LIMIT 5 ";

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
