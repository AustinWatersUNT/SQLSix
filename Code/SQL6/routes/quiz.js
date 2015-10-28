var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connectionCredentials = require('./credentials');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('quiz', {});
});

router.post('/quizQuery', function(req, res) {
  var query = req.body;

  //Create Query String
  var queryString = "SELECT p.name, p.city, p.state FROM booking as b " +
      "LEFT JOIN (SELECT Id, Name, City, State FROM properties) as p " +
      "ON b.PropertyId = p.Id " +
      "WHERE p.State = '" + query.State + "' && b.Adults = '" + query.Adults + "' && b.Children = '" + query.Children + "' && ";

    queryString += "b.Rate >= " + query.LowRate + " && b.Rate <= " + query.HighRate + " ";

      queryString += "GROUP BY PropertyId " +
      "ORDER BY Count(PropertyId) desc " +
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
