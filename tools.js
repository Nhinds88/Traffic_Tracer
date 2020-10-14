const request = require('request');
const mysql = require("mysql");
const { spawn } = require('child_process')

module.exports = {
    createConnection: function() {
        /**
         * creates database connection
         * @return database connection
         */
        var conn = mysql.createConnection({
            connectionLimit: 100000,
            host: "d1kb8x1fu8rhcnej.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
            user: "cg0qk6kstr07a5z4",
            password: "dw56x2swou8s05vw",
            database: "ljovr7av2qudtk53"
        });
        return conn;
    },

    peopleCount: function(req, res) {

        // var spawn = require("child_process").spawn;

        // Parameters passed in spawn - 
        // 1. type_of_script 
        // 2. list containing Path of the script 
        //    and arguments for the script  

        spawn('python', ["./python/people_counter.py",
            req.body.video,
            req.body.x1,
            req.body.y1,
            req.body.x2,
            req.body.y2,
            req.body.v_or_h,
            req.body.contourLimit,
            req.body.merchantid
        ]);

        // Takes stdout data from script which executed 
        // with arguments and send this data to res object 
        // process.stdout.on('data', function(data) {
        //     res.send(data.toString());
        // })
    }
}