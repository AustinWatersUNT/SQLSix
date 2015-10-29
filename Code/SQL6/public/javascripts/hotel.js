var customerTable;
var propertiesTable;
var cancelbookedpie;
var currentProperties = [];

var selectedHotel = {};
var formSelectedHotel = {};

$(document).ready(function() {
	//customerTable = $("#customerTable").DataTable();
	propertiesTable = $("#propertiesTable").DataTable(); //Turns our propertiesTable into a DataTable

	//Code to select an item from the table
	$('#propertiesTable tbody').on( 'click', 'tr', function () {
		if ( $(this).hasClass('selected') ) {
			$(this).removeClass('selected');
			$("#hotelSelectSubmit").prop("disabled",true);
			$(this).css("background-color", "white");
		}
		else {
			propertiesTable.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
			//When an item is selected this grabs the data from the table
			var innerItems = $(this)[0].childNodes;
			formSelectedHotel = {
				Id: innerItems[0].innerText,
				Name: innerItems[1].innerText
			};
			$("#hotelSelectSubmit").prop("disabled", false);
		}
	});

	$('#propertiesTable tbody').on( 'mouseover', 'tr', function () {
		if(!$(this).hasClass('selected')) $(this).addClass('hover_table');
	});

	$('#propertiesTable tbody').on( 'mouseout', 'tr', function () {
		if(!$(this).hasClass('selected')) $(this).removeClass('hover_table');
	});


	$('#hotelSelect').modal({
		backdrop: 'static',
		keyboard: false
	})
});

var map;
var mapLocation = {J: 33.215, M: -97.133};

//Initalize a Map, This function just takes in a City, State
function initMap(selectedCity) {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
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
		zoom: 15
	});
	var geocoder = new google.maps.Geocoder();

	geocodeAddressHotel(geocoder, map, selectedHotel);
}

function geocodeAddressHotel(geocoder, resultsMap, selectedHotel) {

	var query = {
		Id: selectedHotel.Id
	};

	$.ajax({
		type: 'POST',
		data: JSON.stringify(query), //All json sent to the server must be stringified
		url: './hotel/getLatLng',
		contentType: 'application/json',
		success: function (data) {

			var address = "";

			if(data[0].Latitude == 0) {
				address = selectedHotel.City + ", " + selectedHotel.State;

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
			else {
				resultsMap.setCenter({lat: data[0].Latitude, lng: data[0].Longitude});
				var marker = new google.maps.Marker({
					map: resultsMap,
					position: {lat: data[0].Latitude, lng: data[0].Longitude}
				});
			}
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

	$("#hotelSelectSubmit").prop("disabled",true);

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

	$("#hotelSelectSubmit").prop("disabled",true);

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

	$("#hotelSelectSubmit").prop("disabled",true);

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
					1: data[item].Name
				});
			}
			//prints table
			propertiesTable.draw();
		}
	});
}

function hotelInformation(Id)
{
	var query = {
		Id: Id
	};
	$.ajax({
		type: 'POST',
		data: JSON.stringify(query), //Must stringify all JSON objects before sending
		url: './hotel/hotelInformation', //Same URL is associated on the server
		contentType: 'application/json',
		success: function (data) {

			for(var prop in data[0]) {
				if(data[0][prop] == null) data[0][prop] = 0;
				selectedHotel[prop] = data[0][prop].toFixed(2);
				document.getElementById(prop).innerText = selectedHotel[prop];
			}

			var total = data[0].Bookings + data[0].Modifications + data[0].Cancellations;

			var cancelPercent = data[0].Cancellations == 0 ? 0 : Math.round((data[0].Cancellations/total) * 100);
			var modifyPercent= data[0].Modifications == 0 ? 0 : Math.round((data[0].Modifications/total) * 100);
			var bookingPercent = data[0].Bookings == 0 ? 0 : Math.round((data[0].Bookings/total) * 100);

			bvcData = google.visualization.arrayToDataTable([
				['', 'Total', { role: 'style' }],
				['Bookings', data[0].Bookings, '#007034'],
				['Modifications', data[0].Modifications, "#1078A3"],
				['Cancellations', data[0].Cancellations, '#BC1200']
			]);

			var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
			chart.clearChart();
			chart.draw(bvcData, bvcOptions);

			bookingGauge.update(bookingPercent);
			cancelGauge.update(cancelPercent);
			modifyGauge.update(modifyPercent);
		}
	});
}

function topCustomers(Id) {
	var query = {
		Id: Id
	};
	$.ajax({
		type: 'POST',
		data: JSON.stringify(query), //Must stringify all JSON objects before sending
		url: './hotel/topCustomers', //Same URL is associated on the server
		contentType: 'application/json',
		success: function (data) {

			var tempData = [
				['Customer', 'Total']
			];
			if(data.length > 0) {
				document.getElementById("TopBooker").innerText = data[0].Name;
				for (var item in data) {
					tempData.push([data[item].Name, data[item].Customers]);
				}
			}
			else {
				document.getElementById("TopBooker").innerText = "";
				document.getElementById("LowestRateBooker").innerText = "";
				document.getElementById("LowestRate").innerText = "";
				tempData.push(['', 0]);
			}

			customerData = google.visualization.arrayToDataTable(tempData);

			var chart = new google.visualization.BarChart(document.getElementById('chart_customers'));
			chart.clearChart();
			chart.draw(customerData, customerOptions);

			var insertRateData = [
				['Customer', 'Rate']
			];

			if(data.length > 0) {
				var lowestRate = 0;
				var lowestRateBooker = '';
				for (var item in data) {
					if(data[item].Rate < lowestRate || lowestRate == 0) {
						lowestRate = data[item].Rate;
						lowestRateBooker = data[item].Name;
					}
					insertRateData.push([data[item].Name, parseFloat(data[item].Rate.toFixed(2))]);
				}
				document.getElementById("LowestRateBooker").innerText = lowestRateBooker;
				document.getElementById("LowestRate").innerText = lowestRate.toFixed(2);
			}
			else {
				insertRateData.push(['', 0]);
			}

			rateData = google.visualization.arrayToDataTable(insertRateData);
			var rateChart = new google.visualization.BarChart(document.getElementById('chart_customer_rates'));
			rateChart.clearChart();
			rateChart.draw(rateData, rateOptions);
		}
	});
}


function selectHotel() {
	selectedHotel = formSelectedHotel;
	selectedHotel.City = document.getElementsByName("city")[0].value;
	selectedHotel.State = document.getElementsByName("state")[0].value;
	document.getElementById("hotelTitle").innerText = selectedHotel.Name;
	initMapHotel(selectedHotel);
	hotelInformation(selectedHotel.Id);
	topCustomers(selectedHotel.Id);
	resetForm();
}

function resetForm() {
	$('#hotelForm')[0].reset();
	$("#city").prop("disabled", true);
	$("#state").prop("disabled", true);
	document.getElementById("city").innerHTML =  "<option value=''>Select a City</option>";
	document.getElementById("state").innerHTML =  "<option value=''>Select a State</option>";
	propertiesTable.clear();
	propertiesTable.draw();
	formSelectedHotel = {};
}

google.load('visualization', '1', {packages: ['corechart', 'bar']});
google.setOnLoadCallback(drawBasic);

var bvcData;
var customerData;
var rateData;

var bvcOptions = {
	title: 'Hotel Activity',
	titleTextStyle: {
		fontSize: '20'
	},
	colors: ['#4f4b4b'],
	chartArea: {
		top: '50',
		width: '80%',
		height: '50%'
	},
	legend: {
		position: 'none'
	},
	hAxis: {
		title: 'Total'
	}
};

var customerOptions = {
	title: 'Top Booker',
	titleTextStyle: {
		fontSize: '20'
	},
	colors: ['#1078A3'],
	chartArea: {
		top: '50',
		left: 150,
		width: '70%',
		height: '50%'
	},
	legend: {
		position: 'none'
	},
	hAxis: {
		title: 'Total'
	}
};

var rateOptions = {
	title: 'Booker Rates',
	titleTextStyle: {
		fontSize: '20'
	},
	colors: ['#1078A3'],
	chartArea: {
		top: '50',
		left: 150,
		width: '70%',
		height: '50%'
	},
	legend: {
		position: 'none'
	},
	hAxis: {
		title: 'Rates'
	}
};


function drawBasic() {

	bvcData = google.visualization.arrayToDataTable([
		['', 'Total', { role: 'style' }],
		['Bookings', 0, '#007034'],
		['Modifications', 0, '#1078A3'],
		['Cancellations', 0, '#BC1200']
	]);

	customerData = google.visualization.arrayToDataTable([
		['Customer', 'Total'],
		['', 0]
	]);

	rateData = google.visualization.arrayToDataTable([
		['Customer', 'Rate'],
		['', 0]
	]);

	var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
	chart.draw(bvcData, bvcOptions);

	var customerChart = new google.visualization.BarChart(document.getElementById('chart_customers'));
	customerChart.draw(customerData, customerOptions);

	var ratesChart = new google.visualization.BarChart(document.getElementById('chart_customer_rates'));
	ratesChart.draw(rateData, rateOptions);
}
