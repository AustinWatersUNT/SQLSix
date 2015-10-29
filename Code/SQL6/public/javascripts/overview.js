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

google.load('visualization', '1', {packages: ['corechart', 'bar']});
google.setOnLoadCallback(topHotels());

function topHotels() {
    topHotelsByBooking();
}

function topHotelsByBooking() {
    $.ajax({
        type: 'POST',
        url: './overview/topHotelsByBooking', //Same URL is associated on the server
        contentType: 'application/json',
        success: function (data) {

            topHotelsByCancellations();

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
            console.log(data);

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

grabMapData();