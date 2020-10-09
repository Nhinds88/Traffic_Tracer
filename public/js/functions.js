$(document).ready(function() {

    const getDatesBetween = (startDate, endDate) => {
        const dates = [];

        // Strip hours minutes seconds etc.
        let currentDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
        );

        while (currentDate <= endDate) {
            arrayDate = currentDate.toISOString();
            arrayDate = arrayDate.substring(0, arrayDate.length - 14);
            dates.push(arrayDate);

            currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 1, // Will increase month if over range
            );
        }

        return dates;
    };

    function enterAndExitChart(data1, data2, labels) {
        var ctx = document.getElementById("myChartEOE").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Enter',
                    data: data1,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }, {
                    label: 'Exit',
                    data: data2,
                    borderColor: 'rgba(118, 54, 38 , 1)',
                    backgroundColor: 'rgba(118, 54, 38 , 0.2)',
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return value;
                            }
                        }
                    }]
                }
            }
        });
    }

    function timeChart(data1, data2, labels) {
        var canvas = document.getElementById("myChartTime");
        var graphParams = {
            type: "scatter",
            data: {
                labels: labels,
                datasets: [{
                        label: "Enter",
                        data: data1,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    },
                    {
                        label: "Exit",
                        data: data2,
                        borderColor: 'rgba(118, 54, 38 , 1)',
                        backgroundColor: 'rgba(118, 54, 38 , 0.2)',
                    }
                ],
            },
            options: {
                scales: {
                    xAxes: [{
                        type: "time",
                        time: {
                            displayFormats: {
                                day: 'MMM D'
                            }
                        },
                        distribution: "series",
                    }],
                }
            }
        }
        ctx = new Chart(canvas, graphParams);
    }

    function hourlyChart(data1, data2, labels) {
        var ctx = document.getElementById("myChartHourly").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Enter',
                    data: data1,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }, {
                    label: 'Exit',
                    data: data2,
                    borderColor: 'rgba(118, 54, 38 , 1)',
                    backgroundColor: 'rgba(118, 54, 38 , 0.2)',
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return value;
                            }
                        }
                    }]
                }
            }
        });
    }

    function timeHourlyChart(data1, data2) {
        var canvas = document.getElementById("myChartIndividualHourly");
        var graphParams = {
            type: "scatter",
            data: {
                datasets: [{
                        label: "Enter",
                        data: data1,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    },
                    {
                        label: "Exit",
                        data: data2,
                        borderColor: 'rgba(118, 54, 38 , 1)',
                        backgroundColor: 'rgba(118, 54, 38 , 0.2)',
                    }
                ],
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        distribution: "series",
                    }],
                }
            }
        }
        ctx = new Chart(canvas, graphParams);
    }

    function getCounts(arr, val) {
        var count = 0;
        arr.forEach((v) => (v == val && count++));
        return count;
    }

    $("#getData").on('click', function() {

        date1Temp = new Date($("#d1").val().toString());
        date1 = new Date(date1Temp.getFullYear(), date1Temp.getMonth(), date1Temp.getDate() + 1);
        date2Temp = new Date($("#d2").val().toString());
        date2 = new Date(date2Temp.getFullYear(), date2Temp.getMonth(), date2Temp.getDate() + 1);

        const dates = getDatesBetween(date1, date2);

        console.log(dates);

        $.ajax({
            method: "get",
            url: "/api/countsEnterAndExit",
            data: { "date1": $("#d1").val(), "date2": $("#d2").val() },
            success: function(rows, status) {

                var enterCount = [];
                var enterArray = [];
                var exitCount = [];
                var exitArray = [];

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "enter") {
                        enterArray[index] = row.date.substring(0, row.date.length - 14);
                    }
                });

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "exit") {
                        exitArray[index] = row.date.substring(0, row.date.length - 14);
                    }
                });

                for (i = 0; i < dates.length; i++) {
                    enterCount[i] = getCounts(enterArray, dates[i]);
                }

                for (i = 0; i < dates.length; i++) {
                    exitCount[i] = getCounts(exitArray, dates[i]);
                }

                enterAndExitChart(enterCount, exitCount, dates);
            }
        })
    })

    $("#getTimeData").on('click', function() {

        date1Temp = new Date($("#d1").val().toString());
        date1 = new Date(date1Temp.getFullYear(), date1Temp.getMonth(), date1Temp.getDate() + 1);
        date2Temp = new Date($("#d2").val().toString());
        date2 = new Date(date2Temp.getFullYear(), date2Temp.getMonth(), date2Temp.getDate() + 1);

        const dates = getDatesBetween(date1, date2);

        console.log(dates);

        $.ajax({
            method: "get",
            url: "/api/countsTime",
            data: { "date1": $("#time1").val(), "date2": $("#time2").val() },
            success: function(rows, status) {

                var entertimeArray = [];
                var enterdateArray = [];
                var exittimeArray = [];
                var exitdateArray = [];

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "enter") {
                        enterdateArray[index] = row.date;
                    }
                });

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "exit") {
                        exitdateArray[index] = row.date;
                    }
                });

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "enter") {
                        temp = row.time;
                        timeSplit = temp.split(":");
                        timeString = timeSplit[0] + "." + timeSplit[1] + timeSplit[2];
                        timeEntry = parseFloat(timeString);
                        entertimeArray[index] = timeEntry;
                    }
                });

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "exit") {
                        temp = row.time;
                        timeSplit = temp.split(":");
                        timeString = timeSplit[0] + "." + timeSplit[1] + timeSplit[2];
                        timeEntry = parseFloat(timeString);
                        exittimeArray[index] = timeEntry;
                    }
                });

                var enterdatesandtimes = [];
                var exitdatesandtimes = [];

                for (i = 0; i < enterdateArray.length; i++) {
                    x = enterdateArray[i];
                    y = entertimeArray[i];

                    var json = { x: x, y: y };
                    enterdatesandtimes.push(json);
                }

                for (i = 0; i < exitdateArray.length; i++) {
                    x = exitdateArray[i];
                    y = exittimeArray[i];

                    var json = { x: x, y: y };
                    exitdatesandtimes.push(json);
                }

                timeChart(enterdatesandtimes, exitdatesandtimes, dates);
            }
        })
    })

    $("#getHourlyData").on('click', function() {

        const hours = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"];

        $.ajax({
            method: "get",
            url: "/api/countsHourly",
            data: { "date": $("#day").val() },
            success: function(rows, status) {

                var exitCount = [];
                var enterCount = [];
                var exitTimes = [];
                var enterTimes = [];

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "enter") {
                        temp = row.time;
                        timeSplit = temp.split(":");
                        timeString = timeSplit[0];
                        hourEnter = parseInt(timeString);
                        enterTimes[index] = hourEnter;
                    }
                });

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "exit") {
                        temp = row.time;
                        timeSplit = temp.split(":");
                        timeString = timeSplit[0];
                        hourExit = parseInt(timeString);
                        exitTimes[index] = hourExit;
                    }
                });

                for (i = 0; i < hours.length; i++) {
                    hourCount = getCounts(enterTimes, i);
                    enterCount[i] = hourCount;
                }

                for (i = 0; i < hours.length; i++) {
                    hourCount = getCounts(exitTimes, i);
                    exitCount[i] = hourCount;
                }

                hourlyChart(enterCount, exitCount, hours);
            }
        })
    })

    $("#getIndividualHourlyData").on('click', function() {

        const hours = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"];

        $.ajax({
            method: "get",
            url: "/api/individualHourly",
            data: { "date": $("#scatterDay").val() },
            success: function(rows, status) {

                var entertimeArray = [];
                var enterhourArray = [];
                var exittimeArray = [];
                var exithourArray = [];

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "enter") {
                        enterhourArray[index] = 0;
                    }
                });

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "exit") {
                        exithourArray[index] = 0;
                    }
                });

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "enter") {
                        temp = row.time;
                        timeSplit = temp.split(":");
                        timeString = timeSplit[0] + "." + timeSplit[1] + timeSplit[2];
                        timeEntry = parseFloat(timeString);
                        entertimeArray[index] = timeEntry;

                        for (i = 0; i < hours.length; i++) {
                            if (timeEntry >= i && i + 1 < timeEntry) {
                                enterhourArray[index] = i;
                            }
                        }
                    }
                });

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "exit") {
                        temp = row.time;
                        timeSplit = temp.split(":");
                        timeString = timeSplit[0] + "." + timeSplit[1] + timeSplit[2];
                        timeEntry = parseFloat(timeString);
                        exittimeArray[index] = timeEntry;

                        for (i = 0; i < hours.length; i++) {
                            if (timeEntry >= i && i + 1 < timeEntry) {
                                exithourArray[index] = i;
                            }
                        }
                    }
                });

                var enterhoursandtimes = [];
                var exithoursandtimes = [];

                for (i = 0; i < enterhourArray.length; i++) {
                    x = enterhourArray[i];
                    y = entertimeArray[i];

                    var json = { x: x, y: y };
                    enterhoursandtimes.push(json);
                }

                for (i = 0; i < exithourArray.length; i++) {
                    x = exithourArray[i];
                    y = exittimeArray[i];

                    var json = { x: x, y: y };
                    exithoursandtimes.push(json);
                }

                timeHourlyChart(enterhoursandtimes, exithoursandtimes);
            }
        })
    })
});