const express = require("express");
const session = require("express-session");
const request = require("request");
const mysql = require("mysql");
var bodyParser = require('body-parser');
const tools = require("./tools.js")

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
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var ssn;

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
});//Login Auth

app.get('/api/countsEnterAndExit', async function(req, res) {

    ssn = req.session;

    console.log("merchant store " + ssn.merchant);

    merchant = '"' + ssn.merchant + '"';

    var sql = 'SELECT merchantid from merchant WHERE merchantname = ' + merchant;

    connection.query(sql, function(error, mid, fields) {
        console.log(mid);
        if (!error) {
            connection.query('SELECT trafficid, enterorexit, date, time FROM foottraffic WHERE merchantid = ' + mid[0].merchantid + ' AND date BETWEEN ? AND ?', [ req.query.date1, req.query.date2], function(error, results, fields) {
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
            connection.query('SELECT trafficid, enterorexit, date, time FROM foottraffic WHERE merchantid = ' + mid[0].merchantid + ' AND date BETWEEN ? AND ?', [ req.query.date1, req.query.date2], function(error, results, fields) {
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
            connection.query('SELECT trafficid, enterorexit, time FROM foottraffic WHERE merchantid = ' + mid[0].merchantid + ' AND date = ?', [ req.query.date], function(error, results, fields) {
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
            connection.query('SELECT trafficid, enterorexit, time FROM foottraffic WHERE merchantid = ' + mid[0].merchantid + ' AND date = ?', [ req.query.date], function(error, results, fields) {
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