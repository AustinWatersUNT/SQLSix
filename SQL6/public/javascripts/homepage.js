var customerTable;
var propertiesTable;
$(document).ready(function() {
	customerTable = $("#customerTable").DataTable();
});

$(document).ready(function() {
	propertiesTable = $("#propertiesTable").DataTable();
});

var map;
var currentPaths = [];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 9,
		center: {lat: 30.2669444, lng: -97.7427778},
		mapTypeId: google.maps.MapTypeId.TERRAIN
	});
}

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

function onCountrySelection() {

	var query = {
		Country: document.getElementsByName("country")[0].value
	};

	document.getElementById("state").innerHTML = "";
	document.getElementById("city").innerHTML = "<option value=''>Select a City</option>";
	propertiesTable.clear().draw();

	if(query.Country != '') {
		$.ajax({
			type: 'POST',
			data: JSON.stringify(query),
			url: './statesByCountry',
			contentType: 'application/json',
			success: function (data) {
				data.sort(compareStates);
				var options = "<option value=''>Select a State</option>";
				for(var item in data) {
					options += "<option value='" + data[item].State + "'>" + data[item].State + "</option>";
				}
				document.getElementById("state").innerHTML = options;
			}
		});
	}
}

function onStateSelection() {

	var query = {
		Country: document.getElementsByName("country")[0].value,
		State: document.getElementsByName("state")[0].value
	};

	document.getElementById("city").innerHTML = "";
	propertiesTable.clear().draw();

	if(query.State != '') {
		$.ajax({
			type: 'POST',
			data: JSON.stringify(query),
			url: './citiesByState',
			contentType: 'application/json',
			success: function (data) {
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
	var query = {
		State: document.getElementsByName("state")[0].value,
		City: document.getElementsByName("city")[0].value
	};

	$.ajax({
		type: 'POST',
		data: JSON.stringify(query),
		url: './hotelsByLocation',
		contentType: 'application/json',
		success: function (data) {
			var properties = [];
			propertiesTable.clear();
			for (var item in data) {
				propertiesTable.row.add({
					0:  data[item].Brand,
					1: data[item].PropertyID,
					2: data[item].Name,
					3: data[item].City,
					4: data[item].State,
					5: data[item].Postal,
					6: data[item].Country
				});
			}
			propertiesTable.draw();
		}
	});
}

