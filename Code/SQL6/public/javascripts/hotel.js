var customerTable;
var propertiesTable;
var cancelbookedpie;
var currentProperties = [];

var bookcancelpieOptions = {
	data: [
		{
			type: "pie",
			showInLegend: true,
			toolTipContent: "{y} - #percent %",
			legendText: "{indexLabel}",
			dataPoints: [
				{y: 0, indexLabel: "Booked"},
				{y: 0, indexLabel: "Canceled"}
			]
		}
	]
};



$(document).ready(function() {
	//customerTable = $("#customerTable").DataTable();
	propertiesTable = $("#propertiesTable").DataTable(); //Turns our propertiesTable into a DataTable

	$("#bookcancelpie").CanvasJSChart(bookcancelpieOptions);

	//Code to select an item from the table
	$('#propertiesTable tbody').on( 'click', 'tr', function () {
		if ( $(this).hasClass('selected') ) {
			$(this).removeClass('selected');
		}
		else {
			propertiesTable.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');

			//When an item is selected this grabs the data from the table
			var innerItems = $(this)[0].childNodes;
			var selectedHotel = {
				Id: innerItems[0].innerText,
				Brand: innerItems[1].innerText,
				PropertyId: innerItems[2].innerText,
				Name: innerItems[3].innerText,
				City: innerItems[4].innerText,
				State: innerItems[5].innerText,
				Postal: innerItems[6].innerText,
				Country: innerItems[7].innerText
			};

			//Send the selected hotel to the geocode to get address
			initMapHotel(selectedHotel);
			bookingCount(selectedHotel.Id);
			cancelCount(selectedHotel.Id);
		}
	} );
});

var map;
var mapLocation = {J: -34.397, M: 150.644};

//Initalize a Map, This function just takes in a City, State
function initMap(selectedCity) {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: {lat: mapLocation.J, lng: mapLocation.M}
	});
	var geocoder = new google.maps.Geocoder();

	//Passes the City to the geocode
	if(selectedCity) geocodeAddress(geocoder, map, selectedCity);
}

function geocodeAddress(geocoder, resultsMap, selectedCity) {
	var address = "";
	//Creates an address to search for
	if(selectedCity) address = selectedCity.City + ", " + selectedCity.State;

	//searchs for and gets back a lag and lat result
	geocoder.geocode({'address': address}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			resultsMap.setCenter(results[0].geometry.location);
			mapLocation = results[0].geometry.location;
			var marker = new google.maps.Marker({
				map: resultsMap,
				position: results[0].geometry.location
			});
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

//Does the same as above except, accepts a hotel as the address
function initMapHotel(selectedHotel) {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: {lat: -34.397, lng: 150.644}
	});
	var geocoder = new google.maps.Geocoder();

	geocodeAddressHotel(geocoder, map, selectedHotel);
}

function geocodeAddressHotel(geocoder, resultsMap, selectedHotel) {
	var address = "";
	if(selectedHotel) address = selectedHotel.Name + ", " + selectedHotel.City + ", " + selectedHotel.State;

	geocoder.geocode({'address': address}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			resultsMap.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: resultsMap,
				position: results[0].geometry.location
			});
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

//Used to sort Cities/States
function compareCities(a,b) {
	if (a.City < b.City)
		return -1;
	if (a.City > b.City)
		return 1;
	return 0;
}

function compareStates(a,b) {
	if (a.State < b.State)
		return -1;
	if (a.State > b.State)
		return 1;
	return 0;
}

//When a country is selected, query for the states
function onCountrySelection() {

	//The query parameters
	var query = {
		Country: document.getElementsByName("country")[0].value
	};

	//Clears all of the current select options
	document.getElementById("state").innerHTML =  "<option value=''>Select a State</option>";
	document.getElementById("city").innerHTML = "<option value=''>Select a City</option>";

	$("#state").prop("disabled", true);
	$("#stateLoad").show();
	//Clears and redraws the empty table
	propertiesTable.clear().draw();

	//Makes sure there is a country to search for
	if(query.Country != '') {
		//How to contact the server
		$.ajax({
			type: 'POST',
			data: JSON.stringify(query), //All json sent to the server must be stringified
			url: './hotel/statesByCountry',
			contentType: 'application/json',
			success: function (data) {
				$("#state").prop("disabled", false);
				$("#stateLoad").hide();
				//Uses the return to make options
				data.sort(compareStates);
				var options = "<option value=''>Select a State</option>";

				//Creates all the different state options
				for(var item in data) {
					options += "<option value='" + data[item].State + "'>" + data[item].State + "</option>";
				}

				//Sets the inner html to these new documents
				document.getElementById("state").innerHTML = options;
			}
		});
	}
}

function onStateSelection() {

	//Creates a query object to send to the server
	var query = {
		Country: document.getElementsByName("country")[0].value,
		State: document.getElementsByName("state")[0].value
	};

	//Removes all current city options
	document.getElementById("city").innerHTML =  "<option value=''>Select a City</option>";
	$("#city").prop("disabled", true);
	$("#cityLoad").show();


	//Clear and redraws table
	propertiesTable.clear().draw();

	//Makes sure there is a state to chose from
	if(query.State != '') {
		$.ajax({
			type: 'POST',
			data: JSON.stringify(query),
			url: './hotel/citiesByState',
			contentType: 'application/json',
			success: function (data) {
				$("#city").prop("disabled", false);
				$("#cityLoad").hide();
				data.sort(compareCities);
				var options = "<option value=''>Select a City</option>";
				for(var item in data) {
					options += "<option value='" + data[item].City + "'>" + data[item].City + "</option>";
				}
				document.getElementById("city").innerHTML = options;
			}
		});
	}
}

function hotelQuery()
{
	//Creates a query object to send to the server
	var query = {
		State: document.getElementsByName("state")[0].value,
		City: document.getElementsByName("city")[0].value
	};

	//Places a pointier at the location of the query
	initMap(query);

	//Contacts the server to get all the hotels in that city
	$.ajax({
		type: 'POST',
		data: JSON.stringify(query), //Must stringify all JSON objects before sending
		url: './hotel/hotelsByLocation', //Same URL is associated on the server
		contentType: 'application/json',
		success: function (data) {
			//After returning converts the data so it's readable by the properties table
			currentProperties = data;

			//removes all table values
			propertiesTable.clear();

			//Adds all the rows to the table
			for (var item in data) {
				propertiesTable.row.add({
					0: data[item].Id,
					1: data[item].Brand,
					2: data[item].PropertyId,
					3: data[item].Name,
					4: data[item].City,
					5: data[item].State,
					6: data[item].Postal,
					7: data[item].Country
				});
			}
			//prints table
			propertiesTable.draw();
		}
	});
}

function bookingCount(Id)
{
	//Creates a query object to send to the server
	var query = {
		Id: Id
	};

	//Contacts the server to get all the hotels in that city
	$.ajax({
		type: 'POST',
		data: JSON.stringify(query), //Must stringify all JSON objects before sending
		url: './hotel/bookingById', //Same URL is associated on the server
		contentType: 'application/json',
		success: function (data) {
			var chart = $("#bookcancelpie").CanvasJSChart();
			chart.options.data[0].dataPoints[0].y = data[0].Booked;
			chart.render();
		}
	});
}

function cancelCount(Id)
{
	//Creates a query object to send to the server
	var query = {
		Id: Id
	};

	//Contacts the server to get all the hotels in that city
	$.ajax({
		type: 'POST',
		data: JSON.stringify(query), //Must stringify all JSON objects before sending
		url: './hotel/cancelById', //Same URL is associated on the server
		contentType: 'application/json',
		success: function (data) {
			var chart = $("#bookcancelpie").CanvasJSChart();
			chart.options.data[0].dataPoints[1].y = data[0].Cancelled;
			chart.render();

		}
	});
}



