


$(document).ready(function () {
    // Function to get the value of the select box
    function getSelectedValue() {
        let selectedValue = $('#dateRange').val();
        console.log('Selected value: ' + selectedValue);

        //write all the ajax for updating the here
        $.ajax({
            url: '/admin/report/' + selectedValue,
            method: 'GET',
            success: function (response) {
                // Code to handle a successful response
                $('#totalSales').text(response.data.amount);
                $('#totalOrders').text(response.data.count);
                $('#averageOrder').text(response.data.average);
                $('#totalRevenue').text("not done");

            },
            error: function (xhr, status, error) {
                // Code to handle an error response
                console.log("Request failed: " + error);
            }
        });
    }

    // Call the function on page load
    getSelectedValue();

    // Trigger the function whenever the select box value changes
    $('#dateRange').change(function () {
        getSelectedValue();
    });







});

//for chart data
$(document).ready(function () {
    $.ajax({
        url: '/admin/chartdata',
        method: 'GET',
        success: function (response) {
            // Code to handle a successful response
            const lastFiveDays = getFiveDays();
            // Chart.js code for sales graph
            var ctx = document.getElementById('salesChart').getContext('2d');
            var salesChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: lastFiveDays,
                    datasets: [{
                        label: 'Sales',
                        data: response.salesAmount.reverse(),
                        backgroundColor: 'rgba(52, 144, 220, 0.1)',
                        borderColor: 'rgba(52, 144, 220, 1)',
                        borderWidth: 1,
                        pointRadius: 3,
                        pointBackgroundColor: 'rgba(52, 144, 220, 1)',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(52, 144, 220, 1)',
                        pointHoverBorderColor: '#fff',
                        fill: true,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 200
                            }
                        }
                    }
                }
            });
        },
        error: function (xhr, status, error) {
            // Code to handle an error response
            console.log("Request failed: " + error);
        }
    });



});


//for getting the last five days for chart x axis

function getFiveDays() {
    const currentDate = new Date();
    const datesArray = [];

    // Loop through the last 5 days
    for (let i = 4; i >= 0; i--) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(date);
        datesArray.push(formattedDate);
    }
    return datesArray;
}



