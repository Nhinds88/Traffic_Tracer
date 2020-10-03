$(document).ready(function(){

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

    // need to look up alternate charts for this
    function timeChart(data1, data2, labels) {
        var ctx = document.getElementById("myChartTime").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'scatter',
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
            data: { "date1" : $("#d1").val(),"date2" : $("#d2").val()}, 
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

        date1Temp = new Date($("#time1").val().toString());
        date1 = new Date(date1Temp.getFullYear(), date1Temp.getMonth(), date1Temp.getDate() + 1);
        date2Temp = new Date($("#time2").val().toString());
        date2 = new Date(date2Temp.getFullYear(), date2Temp.getMonth(), date2Temp.getDate() + 1);

        const dates = getDatesBetween(date1, date2); 

        console.log(dates);
        
        $.ajax({
            method: "get", 
            url: "/api/countsTime", 
            data: { "date1" : $("#time1").val(),"date2" : $("#time2").val()}, 
            success: function(rows, status) {

                var entertimeArray = [];
                var enterdateArray = [];
                var exittimeArray = [];
                var exitdateArray = [];

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "enter") {
                        enterdateArray[index] = row.date.substring(0, row.date.length - 14);
                    }
                });

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "exit") {
                        exitdateArray[index] = row.date.substring(0, row.date.length - 14);
                    }
                });

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "enter") {
                        entertimeArray[index] = row.time;
                    }
                });

                rows.forEach(function(row, index) {
                    if (row.enterorexit == "exit") {
                        exittimeArray[index] = row.time;
                    }
                });

                var enterdatesandtimes = [];
                var exitdatesandtimes = [];

                for (i = 0; i < enterdateArray.length; i++) {
                    x = enterdateArray[i];
                    y = entertimeArray[i];

                    var json = {x: x, y: y};
                    enterdatesandtimes.push(json);
                }

                for (i = 0; i < exitdateArray.length; i++) {
                    x = exitdateArray[i];
                    y = exittimeArray[i];

                    var json = {x: x, y: y};
                    exitdatesandtimes.push(json);
                }

                timeChart(enterdatesandtimes, exitdatesandtimes, dates);
            }
        })
    })
});