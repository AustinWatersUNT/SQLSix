function tooltipHtml(n, d){	/* function to create html content string in tooltip div. */
    return "<h4>"+n+"</h4><table>"+
        "<tr><td>Booking</td><td>"+(d.Bookings)+"</td></tr>"+
        "<tr><td>Cancellations</td><td>"+(d.Cancellations)+"</td></tr>"+
        "</table>";
}

/*var sampleData ={};	/* Sample random data. */
/*["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
    "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
    "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
    "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
    "WI", "MO", "AR", "OK", "KS", "LS", "VA"]
    .forEach(function(d){
        var low=Math.round(100*Math.random()),
            mid=Math.round(100*Math.random()),
            high=Math.round(100*Math.random());
        sampleData[d]={low:d3.min([low,mid,high]), high:d3.max([low,mid,high]),
            avg:Math.round((low+mid+high)/3), color:d3.interpolate("#0dff25", "#007034")(low/100)};
    });*/

/* draw states on id #statesvg */

function grabMapData() {
    $.ajax({
        type: 'POST',
        url: './overview/statesdata', //Same URL is associated on the server
        contentType: 'application/json',
        success: function (data) {
            var sampleData = {};
            for (var state in data) {
                sampleData[data[state].State] = {
                    Bookings: data[state].Bookings,
                    Cancellations: data[state].Cancellations,
                    color: d3.interpolate("#0dff25", "#007034")((data[state].Bookings / 47485))
                };
            }
            uStates.draw("#statesvg", sampleData, tooltipHtml);
        }
    });
}

google.load('visualization', '1', {packages: ['corechart', 'bar', 'line']});
google.setOnLoadCallback(topHotels());

function topHotels() {
    customersByBooking();
    topHotelsByBooking();
}

function topHotelsByBooking() {
    $.ajax({
        type: 'POST',
        url: './overview/topHotelsByBooking', //Same URL is associated on the server
        contentType: 'application/json',
        success: function (data) {

            topHotelsByCancellations();
            byInDate();

            var bookingData;

            var bookingOptions = {
                title: 'Most Reservations',
                titleTextStyle: {
                    fontSize: '20'
                },
                colors: ['#007034'],
                chartArea: {
                    top: '50',
                    left: 220,
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

           var booking = [['Hotel', 'Reservations Booked']];

            for(var item in data)
            {
                booking.push([data[item].name, data[item].Bookings]);
            }

            bookingData = google.visualization.arrayToDataTable(booking);

            var chart = new google.visualization.BarChart(document.getElementById('chart_bookings'));
            chart.draw(bookingData, bookingOptions);
        }
    });
}


function topHotelsByCancellations() {
    $.ajax({
        type: 'POST',
        url: './overview/topHotelsByCancellation', //Same URL is associated on the server
        contentType: 'application/json',
        success: function (data) {

            var cancelData;

            var cancelOptions = {
                title: 'Most Cancellations',
                titleTextStyle: {
                    fontSize: '20'
                },
                colors: ['#BC1200'],
                chartArea: {
                    top: '50',
                    left: 220,
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

            var cancel = [['Hotel', 'Reservations Cancelled']];

            for(var item in data)
            {
                cancel.push([data[item].name, data[item].Cancellations]);
            }

            cancelData = google.visualization.arrayToDataTable(cancel);

            var chart = new google.visualization.BarChart(document.getElementById('chart_cancel'));
            chart.draw(cancelData, cancelOptions);
        }
    });
}

function byInDate() {
    $.ajax({
        type: 'POST',
        url: './overview/byInDate', //Same URL is associated on the server
        contentType: 'application/json',
        success: function (returnData) {

            var chartDiv = document.getElementById('byInDate');

            var data = new google.visualization.DataTable();
            data.addColumn('date', 'Day');
            data.addColumn('number', "Booking");
            data.addColumn('number', "Cancel");
            data.addColumn('number', "Search");

            var rows = [];

            for (var item in returnData) {
                for (var prop in returnData[item]) {
                    if (returnData[item][prop] == null) returnData[item][prop] = 0;
                }
                rows.push([
                    new Date(returnData[item].InDate),
                    returnData[item].book_count,
                    returnData[item].cancel_count,
                    returnData[item].search_count
                ]);
            }

            data.addRows(rows);

            var materialOptions = {
                chart: {
                    title: 'Bookings, Cancellations and Searches by In Date'
                },
                width: '100%',
                height: 600,
                axes: {
                    // Adds labels to each axis; they don't have to match the axis names.
                    y: {
                        Amount: {label: 'Amount'}
                    }
                },
                colors: ['#007034', '#BC1200', '#1078A3']
            };

            var materialChart = new google.charts.Line(chartDiv);
            materialChart.draw(data, materialOptions);

            byOutDate();
        }
    });
}

function byOutDate() {
    $.ajax({
        type: 'POST',
        url: './overview/byOutDate', //Same URL is associated on the server
        contentType: 'application/json',
        success: function (returnData) {

            var outChart = document.getElementById('byOutDate');

            var data = new google.visualization.DataTable();
            data.addColumn('date', 'Day');
            data.addColumn('number', "Booking");
            data.addColumn('number', "Cancel");
            data.addColumn('number', "Search");

            var rows = [];

            for (var item in returnData) {
                for (var prop in returnData[item]) {
                    if (returnData[item][prop] == null) returnData[item][prop] = 0;
                }
                rows.push([
                    new Date(returnData[item].OutDate),
                    returnData[item].book_count,
                    returnData[item].cancel_count,
                    returnData[item].search_count
                ]);
            }

            data.addRows(rows);

            var chartOptions = {
                chart: {
                    title: 'Bookings, Cancellations and Searches by Out Date'
                },
                width: '100%',
                height: 600,
                axes: {
                    // Adds labels to each axis; they don't have to match the axis names.
                    y: {
                        Amount: {label: 'Amount'}
                    }
                },
                colors: ['#007034', '#BC1200', '#1078A3']
            };

            var chart = new google.charts.Line(outChart);
            chart.draw(data, chartOptions);
        }
    });
}

function customersByBooking() {
    $.ajax({
        type: 'POST',
        url: './overview/customersByBooking', //Same URL is associated on the server
        contentType: 'application/json',
        success: function (data) {

            var bookingData;
            var rateData;

            var bookingOptions = {
                title: 'Top Bookings By Customers',
                titleTextStyle: {
                    fontSize: '20'
                },
                colors: ['#1078A3'],
                chartArea: {
                    top: '50',
                    left: 220,
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
                title: 'Top Bookings By Customers',
                titleTextStyle: {
                    fontSize: '20'
                },
                colors: ['#1078A3'],
                chartArea: {
                    top: '50',
                    left: 220,
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

            var booking = [['Customer', 'Reservations Booked']];
            var rate = [['Customer', 'Average Rate']];


            for(var item in data)
            {
                booking.push([data[item].name, data[item].Bookings]);
                rate.push([data[item].name, data[item].Average]);
            }

            bookingData = google.visualization.arrayToDataTable(booking);
            rateData = google.visualization.arrayToDataTable(rate);

            var chart = new google.visualization.BarChart(document.getElementById('chart_customers'));
            chart.draw(bookingData, bookingOptions);

            chart = new google.visualization.BarChart(document.getElementById('chart_rate'));
            chart.draw(rateData, rateOptions);
        }
    });
}

function customersByBookingRate() {
    $.ajax({
        type: 'POST',
        url: './overview/customersByBooking', //Same URL is associated on the server
        contentType: 'application/json',
        success: function (data) {

            var bookingData;

            var bookingOptions = {
                title: 'Lowest Average Booking Rate By Customers',
                titleTextStyle: {
                    fontSize: '20'
                },
                colors: ['#1078A3'],
                chartArea: {
                    top: '50',
                    left: 220,
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

            var booking = [['Customer', 'Average Rate']];


            for(var item in data)
            {
                booking.push([data[item].name, data[item].Average]);
            }

            bookingData = google.visualization.arrayToDataTable(booking);

            var chart = new google.visualization.BarChart(document.getElementById('chart_rate'));
            chart.draw(bookingData, bookingOptions);
        }
    });
}

grabMapData();