const mysql = require("mysql");
const spawn = require('child_process').spawn;

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

    // Not Fully implemented, This aspect of the project is handled in another application for now
    peopleCount: function(req, res) {

        const counter = spawn('python', ['--version']);

        counter.stdout.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        counter.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        counter.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

        // var childProcess = require("child_process").spawn('python', ['./python/people_counter.py'],
        //     req.body.video,
        //     req.body.x1,
        //     req.body.y1,
        //     req.body.x2,
        //     req.body.y2,
        //     req.body.v_or_h,
        //     req.body.contourLimit,
        //     req.body.merchantid,
        //      {stdio: "inherit"})
        // childProcess.on('data', function(data){
        //     process.stdout.write("python script output",data);
        // });
        // childProcess.on('close', function(code) {
        //         if ( code === 1 ){
        //             process.stderr.write("error occured",code);
        //             process.exit(1);
        //         }
        //         else{
        //             process.stdout.write('"python script exist with code: ' + code + '\n');
        //         }
        // });
    }
}