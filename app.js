const express = require("express");
const session = require("express-session");
const request = require("request");
const mysql = require("mysql");
const bodyParser = require('body-parser');
const tools = require("./tools.js");
const uuid = require('uuid/v4');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json({ limit: '1mb' }));

// connection
var connection = tools.createConnection();

// // configure passport.js to use the local strategy
// passport.use(new LocalStrategy(
//     { usernameField: 'username' },
//     (email, password, done) => {
//       console.log('Inside local strategy callback')
//       // here is where you make a call to the database
//       // to find the user based on their username or email address
//       // for now, we'll just pretend we found that it was users[0]
//       const user = users[0] 
//       if(email === user.email && password === user.password) {
//         console.log('Local strategy returned true')
//         return done(null, user)
//       }
//     }
// ));
  
// // tell passport how to serialize the user
// passport.serializeUser((user, done) => {
//     console.log('Inside serializeUser callback. User id is save to the session file store here')
//     done(null, user.id);
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
  
// app.use(passport.initialize());
// app.use(passport.session());

var ssn;

var fonts = {
    Roboto: {
        normal: "fonts/Roboto-Regular.ttf",
        bold: "fonts/Roboto-Medium.ttf",
        italics: "fonts/Roboto-Italic.ttf",
        bolditalics: "fonts/Roboto-MediumItalic.ttf"
    }
};

var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
var fs = require('fs');
//routes

//root route
app.get("/", async function(req, res) {
    ssn = req.session;
    // ssn.loggedin = false;
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

app.get("/logout", async function(req, res) {
    ssn = req.session;
    ssn.loggedin = false;
    res.redirect('/');
}); //log out

//Dashboard
app.get("/dashboard", async function(req, res) {
    if (req.session.loggedin != true){
        res.redirect('/login');
    } else {
        res.render("dashboard");
    }
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

// counts occurrence of value in an array 
function getCounts(arr, val) {
    var count = 0;
    arr.forEach((v) => (v == val && count++));
    return count;
}

app.post("/api/countspdf", (req, res) => {

    ssn = req.session;

    console.log("merchant store " + ssn.merchant);

    merchant = '"' + ssn.merchant + '"';

    var sql = 'SELECT merchantid from merchant WHERE merchantname = ' + merchant;

    connection.query(sql, function(error, mid, fields) {
        console.log(mid);
        if (!error) {
            sql = "SELECT DATE_FORMAT(date, '%Y-%m-%d') d, COUNT(trafficid) AS c FROM foottraffic where merchantid = " + mid[0].merchantid + " AND date between '" + req.body.entry1 + "' AND '" + req.body.entry2 + "' GROUP BY d";
            connection.query(sql, function(error, results, fields) {
                if (!error) {
                    console.log(results);
                    var dataSQL = [];

                    results.forEach(function(row, index) {
                        dataSQL.push({
                            'date': row.d,
                            'time': row.c
                        })
                    })

                    var now = new Date();
                    now = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

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
                    console.log(error);
                }
            })
        } else {
            console.log(error)
        }
    });
});

app.get("/api/showDailyCountspdf", (req, res) => {
    var filePath = "/pdfs/dailyCounts.pdf";

    fs.readFile(__dirname + filePath, function(err, data) {
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

    fs.readFile(__dirname + filePath, function(err, data) {
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

    fs.readFile(__dirname + filePath, function(err, data) {
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.post("/api/dayEnterCountspdf", (req, res) => {

    ssn = req.session;

    console.log("merchant store " + ssn.merchant);

    merchant = '"' + ssn.merchant + '"';

    var sql = 'SELECT merchantid from merchant WHERE merchantname = ' + merchant;

    const hours = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"];

    pdfPath = '/pdfs/' + merchant + 'dayEnterCounts.pdf';

    connection.query(sql, function(error, mid, fields) {
        console.log(mid);
        if (!error) {
            sql = "SELECT trafficid, enterorexit, time FROM foottraffic WHERE merchantid = " + mid[0].merchantid + " AND date = '" + req.body.dayEnterPDF + "'";
            connection.query(sql, function(error, results, fields) {
                if (!error) {
                    console.log(results);
                    var dataSQL = [];
                    var enterCount = [];
                    var enterTimes = [];

                    results.forEach(function(row, index) {
                        if (row.enterorexit == "enter") {
                            temp = row.time;
                            timeSplit = temp.split(":");
                            timeString = timeSplit[0];
                            hourEnter = parseInt(timeString);
                            enterTimes[index] = hourEnter;
                        }
                    });

                    for (i = 0; i < hours.length; i++) {
                        hourCount = getCounts(enterTimes, i);
                        enterCount[i] = hourCount;
                    }

                    hours.forEach(function(row, index) {
                        dataSQL.push({
                            'hour': row,
                            'count': enterCount[index]
                        })
                    })

                    var now = new Date();
                    now = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

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
                            { text: 'Hourly Enter Count Data', color: '#336B87', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                            table(dataSQL, ['hour', 'count'], ['*', '*'], true, [{ text: 'Hour', color: '#336B87', bold: true }, { text: 'Count', color: '#336B87', bold: true }], '')
                        ]
                    }

                    var pdfDoc = printer.createPdfKitDocument(dd);
                    pdfDoc.pipe(fs.createWriteStream('pdfs/dayEnterCounts.pdf'));
                    pdfDoc.end();
                    res.redirect('/api/showDayEnterCountspdf');

                } else {
                    console.log(error);
                }
            })
        } else {
            console.log(error)
        }
    });
});

app.get("/api/showDayEnterCountspdf", (req, res) => {
    var filePath = "/pdfs/dayEnterCounts.pdf";

    fs.readFile(__dirname + filePath, function(err, data) {
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.post("/api/dayExitCountspdf", (req, res) => {

    ssn = req.session;

    console.log("merchant store " + ssn.merchant);

    merchant = '"' + ssn.merchant + '"';

    var sql = 'SELECT merchantid from merchant WHERE merchantname = ' + merchant;

    const hours = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"];

    connection.query(sql, function(error, mid, fields) {
        console.log(mid);
        if (!error) {
            sql = "SELECT trafficid, enterorexit, time FROM foottraffic WHERE merchantid = " + mid[0].merchantid + " AND date = '" + req.body.dayExitPDF + "'";
            connection.query(sql, function(error, results, fields) {
                if (!error) {
                    console.log(results);
                    var dataSQL = [];
                    var enterCount = [];
                    var enterTimes = [];

                    results.forEach(function(row, index) {
                        if (row.enterorexit == "exit") {
                            temp = row.time;
                            timeSplit = temp.split(":");
                            timeString = timeSplit[0];
                            hourEnter = parseInt(timeString);
                            enterTimes[index] = hourEnter;
                        }
                    });

                    for (i = 0; i < hours.length; i++) {
                        hourCount = getCounts(enterTimes, i);
                        enterCount[i] = hourCount;
                    }

                    hours.forEach(function(row, index) {
                        dataSQL.push({
                            'hour': row,
                            'count': enterCount[index]
                        })
                    })

                    var now = new Date();
                    now = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

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
                            { text: 'Hourly Exit Count Data', color: '#336B87', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                            table(dataSQL, ['hour', 'count'], ['*', '*'], true, [{ text: 'Hour', color: '#336B87', bold: true }, { text: 'Count', color: '#336B87', bold: true }], '')
                        ]
                    }

                    var pdfDoc = printer.createPdfKitDocument(dd);
                    pdfDoc.pipe(fs.createWriteStream('pdfs/dayExitCounts.pdf'));
                    pdfDoc.end();
                    res.redirect('/api/showDayExitCountspdf');

                } else {
                    console.log(error);
                }
            })
        } else {
            console.log(error)
        }
    });
});

app.get("/api/showDayExitCountspdf", (req, res) => {
    var filePath = "/pdfs/dayExitCounts.pdf";

    fs.readFile(__dirname + filePath, function(err, data) {
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.post("/api/entryIndividualpdf", (req, res) => {

    ssn = req.session;

    console.log("merchant store " + ssn.merchant);

    merchant = '"' + ssn.merchant + '"';

    var sql = 'SELECT merchantid from merchant WHERE merchantname = ' + merchant;

    connection.query(sql, function(error, mid, fields) {
        console.log(mid);
        if (!error) {
            connection.query('SELECT trafficid, date, time FROM foottraffic WHERE enterorexit = "enter" AND merchantid = ' + mid[0].merchantid + ' AND date = ?', [req.body.entry], function(error, results, fields) {
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
                            { text: 'Single Date Entry Data', color: '#336B87', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                            table(dataSQL, ['trafficid', 'date', 'time'], ['*', '*', '*'], true, [{ text: 'ID', color: '#336B87', bold: true }, { text: 'Date', color: '#336B87', bold: true }, { text: 'Time', color: '#336B87', bold: true }], '')
                        ]
                    }

                    var now = new Date();
                    var pdfDoc = printer.createPdfKitDocument(dd);
                    pdfDoc.pipe(fs.createWriteStream('pdfs/enter1day.pdf'));
                    pdfDoc.end();
                    console.log(new Date() - now);
                    res.redirect('/api/showenter1daypdf');

                } else {
                    console.log(error)
                }
            })
        } else {
            console.log(error)
        }
    });
});

app.get("/api/showenter1daypdf", (req, res) => {
    var filePath = "/pdfs/enter1day.pdf";

    fs.readFile(__dirname + filePath, function(err, data) {
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.post("/api/exitIndividualpdf", (req, res) => {

    ssn = req.session;

    console.log("merchant store " + ssn.merchant);

    merchant = '"' + ssn.merchant + '"';

    var sql = 'SELECT merchantid from merchant WHERE merchantname = ' + merchant;

    connection.query(sql, function(error, mid, fields) {
        console.log(mid);
        if (!error) {
            connection.query('SELECT trafficid, date, time FROM foottraffic WHERE enterorexit = "exit" AND merchantid = ' + mid[0].merchantid + ' AND date = ?', [req.body.exit], function(error, results, fields) {
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
                            { text: 'Single Date Exit Data', color: '#336B87', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                            table(dataSQL, ['trafficid', 'date', 'time'], ['*', '*', '*'], true, [{ text: 'ID', color: '#336B87', bold: true }, { text: 'Date', color: '#336B87', bold: true }, { text: 'Time', color: '#336B87', bold: true }], '')
                        ]
                    }

                    var now = new Date();
                    var pdfDoc = printer.createPdfKitDocument(dd);
                    pdfDoc.pipe(fs.createWriteStream('pdfs/exit1day.pdf'));
                    pdfDoc.end();
                    console.log(new Date() - now);
                    res.redirect('/api/showexit1daypdf');

                } else {
                    console.log(error)
                }
            })
        } else {
            console.log(error)
        }
    });
});

app.get("/api/showexit1daypdf", (req, res) => {
    var filePath = "/pdfs/exit1day.pdf";

    fs.readFile(__dirname + filePath, function(err, data) {
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