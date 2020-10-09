const express = require("express");
const session = require("express-session");
const request = require("request");
const mysql = require("mysql");
var bodyParser = require('body-parser');
const tools = require("./tools.js")
const router = express.Router();
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json({ limit: '1mb' }));

// connection
var connection = tools.createConnection();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var ssn;

var fonts = {
    Roboto: {
        normal: "fonts/Roboto-Regular.ttf",
        bold: "fonts/Roboto-Medium.ttf",
        italics: "fonts/Roboto-Italic.ttf",
        bolditalics: "fonts/Roboto-MediumItalic.ttf"
    }
};

// const pdfMake = require('../pdfmake/pdfmake');
// const vfsFonts = require('../pdfmake/vfs_fonts');

// pdfMake.vfs = vfsFonts.pdfMake.vfs;

// var pdfMake = require('pdfmake/build/pdfmake.js');
// var pdfFonts = require('pdfmake/build/vfs_fonts.js');
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
var fs = require('fs');
//routes

//root route
app.get("/", async function(req, res) {
    res.render("index");
}); //root route

//How it works
app.get("/howitworks", async function(req, res) {
    res.render("howitworks");
}); //How it works

//features
app.get("/features", async function(req, res) {
    res.render("features");
}); //features

//Demo
app.get("/demo", async function(req, res) {
    res.render("demo");
}); //Demo

//Login
app.get("/login", async function(req, res) {
    res.render("login");
}); //Login

//Dashboard
app.get("/dashboard", async function(req, res) {
    res.render("dashboard");
}); //Dashboard

//Login Auth
app.post("/auth", async function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    ssn = req.session;

    if (username && password) {

        connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {

            console.log("Query result: ", results);
            console.log("Error: ", error);

            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                ssn.merchant = results[0].merchant;
                res.redirect('/dashboard');
            } else {
                res.send('Incorrect enter Username and/or Password!');
            }
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
}); //Login Auth

app.get('/api/countsEnterAndExit', async function(req, res) {

    ssn = req.session;

    console.log("merchant store " + ssn.merchant);

    merchant = '"' + ssn.merchant + '"';

    var sql = 'SELECT merchantid from merchant WHERE merchantname = ' + merchant;

    connection.query(sql, function(error, mid, fields) {
        console.log(mid);
        if (!error) {
            connection.query('SELECT trafficid, enterorexit, date, time FROM foottraffic WHERE merchantid = ' + mid[0].merchantid + ' AND date BETWEEN ? AND ?', [req.query.date1, req.query.date2], function(error, results, fields) {
                if (!error) {
                    res.send(results);
                } else {
                    console.log(error)
                }
            })
        } else {
            console.log(error)
        }
    });
});

app.get('/api/countsTime', async function(req, res) {

    ssn = req.session;

    console.log("merchant store " + ssn.merchant);

    merchant = '"' + ssn.merchant + '"';

    var sql = 'SELECT merchantid from merchant WHERE merchantname = ' + merchant;

    connection.query(sql, function(error, mid, fields) {
        console.log(mid);
        if (!error) {
            connection.query('SELECT trafficid, enterorexit, date, time FROM foottraffic WHERE merchantid = ' + mid[0].merchantid + ' AND date BETWEEN ? AND ?', [req.query.date1, req.query.date2], function(error, results, fields) {
                if (!error) {
                    res.send(results);
                } else {
                    console.log(error)
                }
            })
        } else {
            console.log(error)
        }
    });
});

app.get('/api/countsHourly', async function(req, res) {

    ssn = req.session;

    console.log("merchant store " + ssn.merchant);

    merchant = '"' + ssn.merchant + '"';

    var sql = 'SELECT merchantid from merchant WHERE merchantname = ' + merchant;

    connection.query(sql, function(error, mid, fields) {
        console.log(mid);
        if (!error) {
            connection.query('SELECT trafficid, enterorexit, time FROM foottraffic WHERE merchantid = ' + mid[0].merchantid + ' AND date = ?', [req.query.date], function(error, results, fields) {
                if (!error) {
                    res.send(results);
                } else {
                    console.log(error)
                }
            })
        } else {
            console.log(error)
        }
    });
});

app.get('/api/individualHourly', async function(req, res) {

    ssn = req.session;

    console.log("merchant store " + ssn.merchant);

    merchant = '"' + ssn.merchant + '"';

    var sql = 'SELECT merchantid from merchant WHERE merchantname = ' + merchant;

    connection.query(sql, function(error, mid, fields) {
        console.log(mid);
        if (!error) {
            connection.query('SELECT trafficid, enterorexit, time FROM foottraffic WHERE merchantid = ' + mid[0].merchantid + ' AND date = ?', [req.query.date], function(error, results, fields) {
                if (!error) {
                    res.send(results);
                } else {
                    console.log(error)
                }
            })
        } else {
            console.log(error)
        }
    });
});


///////////////////////////////////////////////////////////////////////////////////////////////
// PDF Reports

Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, ''); // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

// Table body builder
function buildTableBody(data, columns, showHeaders, headers) {
    var body = [];
    // Inserting headers
    if (showHeaders) {
        body.push(headers);
    }

    // Inserting items from external data array
    data.forEach(function(row) {
        var dataRow = [];
        var i = 0;

        columns.forEach(function(column) {
            dataRow.push({ text: Object.byString(row, column), alignment: headers[i].alignmentChild });
            i++;
        })
        body.push(dataRow);

    });

    return body;
}

// Func to return generated table
function table(data, columns, witdhsDef, showHeaders, headers, layoutDef) {
    return {
        table: {
            headerRows: 1,
            widths: witdhsDef,
            body: buildTableBody(data, columns, showHeaders, headers)
        },
    };
}

// Counts within an Array
function getCounts(arr, val) {
    var count = 0;
    arr.forEach((v) => (v == val && count++));
    return count;
}

// 
var getDatesBetween = (startDate, endDate) => {
    var dates = [];

    // Strip hours minutes seconds etc.
    let currentDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );

    while (currentDate <= endDate) {
        arrayDate = currentDate.toISOString();
        arrayDate = arrayDate.substring(0, arrayDate.length - 14);
        // arrayDate = arrayDate;
        dates.push(arrayDate);

        currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1, // Will increase month if over range
        );
    }

    return dates;
};

var dayCounts = (dates, mid) => {
    return new Promise((resolve, reject) => {
        sql = "SELECT trafficid FROM foottraffic WHERE merchantid = " + mid[0].merchantid + " AND date = '" + dates + "'";
        connection.query(sql, function(error, results, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                count = results.length;
            }
            resolve(true);
        })
    })
}

app.post("/api/countspdf", (req, res) => {

    ssn = req.session;

    console.log("merchant store " + ssn.merchant);

    merchant = '"' + ssn.merchant + '"';

    var sql = 'SELECT merchantid from merchant WHERE merchantname = ' + merchant;

    connection.query(sql, function(error, mid, fields) {
        console.log(mid);
        if (!error) {
            date1Temp = new Date(req.body.entry1.toString());
            date1 = new Date(date1Temp.getFullYear(), date1Temp.getMonth(), date1Temp.getDate() + 1);
            date2Temp = new Date(req.body.entry2.toString());
            date2 = new Date(date2Temp.getFullYear(), date2Temp.getMonth(), date2Temp.getDate() + 1);

            var dates = getDatesBetween(date1, date2);

            var dataSQL = [];
            var enterCount = [];
            var enterArray = [];

            for (i = 0; i < dates.length; i++) {
                // sql = "SELECT trafficid FROM foottraffic WHERE merchantid = " + mid[0].merchantid + " AND date = '" + dates[i] + "'";
                // connection.query(sql, function(error, results, fields) {
                //     // console.log(results.length);
                //     // setCountArray(results.length);
                //     if (error) {
                //         console.log(error);
                //     } else {
                //         count = results.length;
                //     }
                // })
                enterCount[i] = dayCounts(dates[i], mid).then(() => count);
            }

            // function setCountArray(result) {
            //     enterCount[i] = result;
            //     //console.log(enterCount[i]);
            // }
            // connection.query('SELECT date, time FROM foottraffic WHERE enterorexit = "enter" AND merchantid = ' + mid[0].merchantid + ' AND date BETWEEN ? AND ?', [req.body.entry1, req.body.entry2], function(error, results, fields) {
            //     if (!error) {

                    // var dataSQL = [];
                    // var enterCount = [];
                    // var enterArray = [];

            //         // date1Temp = new Date(req.body.entry1.toString());
            //         // date1 = new Date(date1Temp.getFullYear(), date1Temp.getMonth(), date1Temp.getDate() + 1);
            //         // date2Temp = new Date(req.body.entry2.toString());
            //         // date2 = new Date(date2Temp.getFullYear(), date2Temp.getMonth(), date2Temp.getDate() + 1);

            //         // var dates = getDatesBetween(date1, date2);

            //         // // for (i = 0; i < dates.length; i++) {
            //         // //     console.log(dates[i]) 
            //         // // }

            //         // results.forEach(function(row, index) {
            //         //     // temp = row.date;
            //         //     // enterArray[index] = temp.getFullYear()+"-"+(temp.getMonth()+1)+"-"+temp.getDate();
            //         //     var myDate = new Date(row.epoch_time * 1000);
            //         //     enterArray[index] = myDate;
            //         // });

            //         // for (i = 0; i < enterArray.length; i++) {
            //         //     console.log("Date to be check " + enterArray[i]);
            //         // }

            //         // for (i = 0; i < dates.length; i++) {
            //         //     enterCount[i] = getCounts(enterArray, dates[i]);
            //         // }
            for (i = 0; i < enterCount.length; i++) {
                // enterCount[i] = enterCount[i].toString();
                console.log(enterCount[i]);
            }

            enterCount.forEach(function(row, index) {
                dataSQL.push({
                    'date': row,
                    'time': enterCount[index]
                })
            })

            // for (i = 0; i < dataSQL.length; i++) {
            //     console.log(dataSQL[i]);
            // }

            console.log(dataSQL[0]);

            var now = new Date();
            now = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();

            var dd = {
                background: function() {
                    return {
                        canvas: [{
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 595.28,
                            h: 841.89,
                            color: '#ededed'
                        }]
                    };
                },
                footer: {
                    columns: [
                      { text: now, alignment: 'left' }
                    ]
                },
                content: [
                    { image: './logo/trafficTracerSmall.png' },
                    { text: ssn.merchant, color: '#336B87' },
                    { text: 'Daily Counts Data', color: '#336B87', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                    table(dataSQL, ['date', 'time'], ['*', '*'], true, [{ text: 'Date', color: '#336B87', bold: true }, { text: 'Count', color: '#336B87', bold: true }], '')
                ]
            }

            var pdfDoc = printer.createPdfKitDocument(dd);
            pdfDoc.pipe(fs.createWriteStream('pdfs/dailyCounts.pdf'));
            pdfDoc.end();
            res.redirect('/api/showDailyCountspdf');
        } else {
            console.log(error)
        }
    });
});

app.get("/api/showDailyCountspdf", (req, res) => {
    var filePath = "/pdfs/dailyCounts.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.post("/api/entrypdf", (req, res) => {

    ssn = req.session;

    console.log("merchant store " + ssn.merchant);

    merchant = '"' + ssn.merchant + '"';

    var sql = 'SELECT merchantid from merchant WHERE merchantname = ' + merchant;

    connection.query(sql, function(error, mid, fields) {
        console.log(mid);
        if (!error) {
            connection.query('SELECT trafficid, date, time FROM foottraffic WHERE enterorexit = "enter" AND merchantid = ' + mid[0].merchantid + ' AND date BETWEEN ? AND ?', [req.body.entry1, req.body.entry2], function(error, results, fields) {
                if (!error) {
                    console.log(results[0]);

                    var dataSQL = [];

                    results.forEach(function(row, index) {
                        dataSQL.push({
                            'trafficid': row.trafficid.toString(),
                            'date': row.date.toString().substr(0, 15),
                            'time': row.time.toString()
                        })
                    })

                    var dd = {
                        background: function() {
                            return {
                                canvas: [{
                                    type: 'rect',
                                    x: 0,
                                    y: 0,
                                    w: 595.28,
                                    h: 841.89,
                                    color: '#ededed'
                                }]
                            };
                        },
                        content: [
                            { image: './logo/trafficTracerSmall.png' },
                            { text: ssn.merchant, color: '#336B87' },
                            { text: 'Entry Data', color: '#336B87', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                            table(dataSQL, ['trafficid', 'date', 'time'], ['*', '*', '*'], true, [{ text: 'ID', color: '#336B87', bold: true }, { text: 'Date', color: '#336B87', bold: true }, { text: 'Time', color: '#336B87', bold: true }], '')
                        ]
                    }

                    var now = new Date();
                    var pdfDoc = printer.createPdfKitDocument(dd);
                    pdfDoc.pipe(fs.createWriteStream('pdfs/enter.pdf'));
                    pdfDoc.end();
                    console.log(new Date() - now);
                    res.redirect('/api/showenterpdf');

                } else {
                    console.log(error)
                }
            })
        } else {
            console.log(error)
        }
    });
});

app.get("/api/showenterpdf", (req, res) => {
    var filePath = "/pdfs/enter.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.post("/api/exitpdf", (req, res) => {

    ssn = req.session;

    console.log("merchant store " + ssn.merchant);

    merchant = '"' + ssn.merchant + '"';

    var sql = 'SELECT merchantid from merchant WHERE merchantname = ' + merchant;

    connection.query(sql, function(error, mid, fields) {
        console.log(mid);
        if (!error) {
            connection.query('SELECT trafficid, date, time FROM foottraffic WHERE enterorexit = "exit" AND merchantid = ' + mid[0].merchantid + ' AND date BETWEEN ? AND ?', [req.body.entry1, req.body.entry2], function(error, results, fields) {
                if (!error) {
                    console.log(results[0]);

                    var dataSQL = [];

                    results.forEach(function(row, index) {
                        dataSQL.push({
                            'trafficid': row.trafficid.toString(),
                            'date': row.date.toString().substr(0, 15),
                            'time': row.time.toString()
                        })
                    })

                    var dd = {
                        background: function() {
                            return {
                                canvas: [{
                                    type: 'rect',
                                    x: 0,
                                    y: 0,
                                    w: 595.28,
                                    h: 841.89,
                                    color: '#ededed'
                                }]
                            };
                        },
                        content: [
                            { image: './logo/trafficTracerSmall.png' },
                            { text: ssn.merchant, color: '#336B87' },
                            { text: 'Exit Data', color: '#336B87', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                            table(dataSQL, ['trafficid', 'date', 'time'], ['*', '*', '*'], true, [{ text: 'ID', color: '#336B87', bold: true }, { text: 'Date', color: '#336B87', bold: true }, { text: 'Time', color: '#336B87', bold: true }], '')
                        ]
                    }

                    var now = new Date();
                    var pdfDoc = printer.createPdfKitDocument(dd);
                    pdfDoc.pipe(fs.createWriteStream('pdfs/exit.pdf'));
                    pdfDoc.end();
                    console.log(new Date() - now);
                    res.redirect('/api/showexitpdf');

                } else {
                    console.log(error)
                }
            })
        } else {
            console.log(error)
        }
    });
});

app.get("/api/showexitpdf", (req, res) => {
    var filePath = "/pdfs/exit.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////
/////////////////////////////////////////////
///////////////////////////////////
/////////////////////////
///////////////
/////
/// 

//Contact us
app.get("/contactus", async function(req, res) {
    res.render("contactus");
}); //Contact us

//About us
app.get("/aboutus", async function(req, res) {
    res.render("aboutus");
}); //About us

//Support
app.get("/support", async function(req, res) {
    res.render("support");
}); //Support

//Privacy
app.get("/privacy", async function(req, res) {
    res.render("privacy");
}); //Privacy

//Legal
app.get("/legal", async function(req, res) {
    res.render("legal");
}); //Legal

//Terms
app.get("/terms", async function(req, res) {
    res.render("terms");
}); //Terms

//server listener
var listener = app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Express server is Running...");
    console.log('Listening on port ' + listener.address().port);
});

// connection
var connection = tools.createConnection();