var express = require('express');
var fs = require('fs');
var router = express.Router();
var mysql = require('mysql');
var connectionCredentials = require('./credentials');

router.get('/', function(req, res, next) {

  //Call to make a mqsql connection with your credentials
  var connection = mysql.createConnection(connectionCredentials);

  //connect to database
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + connection.threadId);

    //Grabs all the customers
    connection.query('SELECT * FROM customers', function(err, rows, fields) {
      if (err) throw err;

      //Save the response to customers
      var customers = rows;

      connection.query("SELECT DISTINCT Country FROM properties", function(err, rows, fields) {
        if (err) throw err;

        rows.sort(compareCountries); //Sort the countries in Alphabetical order

        //This renders the variables to homepage. Similar to how PHP sets up html
        res.render('hotel', {
          customers: customers, //Passes Customers
          countries:rows //And Countries to Homepage.ejs
        });
        connection.end();
      });
    });
  });
});

//Country Sort Function
function compareCountries(a,b) {
  if (a.Country < b.Country)
    return -1;
  if (a.Country > b.Country)
    return 1;
  return 0;
}

//Server Function for grabing Hotels by Location
router.post('/hotelsByLocation', function(req, res) {

  var query = req.body; //.body is the JSON you sent to the server

  //Create a query string to search for hotels
  var queryString = "SELECT * FROM properties";
  if(query.State != '' || query.City != '') queryString = queryString + " WHERE";
  if(query.State != '' && query.City != '') queryString = queryString + " State='" + query.State + "' &&  City='" + query.City + "'";
  else if(query.State != '') queryString = queryString + " State='" + query.State + "'";
  else if(query.City != '')queryString = queryString + " City='" + query.City + "'";

  //Make a database connection
  var connection = mysql.createConnection(connectionCredentials);

  //Connect to it
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + connection.threadId);

    //Query the database using our query string
    connection.query(queryString, function(err, rows, fields) {
      if (err) throw err;

      //Send the response back to the page
      res.send(rows);

    });

    connection.end();
    });
});

//Gets Cities by State
router.post('/citiesByState', function(req, res) {
  var query = req.body;

  //Create Query String
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

      //Send the response back to the page
      res.send(rows);

    });

    connection.end();
  });
});

//Get State By Country
router.post('/statesByCountry', function(req, res) {
  var query = req.body;

  //Create Query String
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

      //Send the response back to the page
      res.send(rows);

    });

    connection.end();
  });
});

router.post('/bookingById', function(req, res) {
  var query = req.body;

  //Create Query String
  var queryString = "SELECT COUNT(*) as Booked FROM booking WHERE PropertyId='" + query.Id + "'";

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

router.post('/cancelById', function(req, res) {
  var query = req.body;

  //Create Query String
  var queryString = "SELECT COUNT(*) as Cancelled FROM cancel WHERE PropertyId='" + query.Id + "'";

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
