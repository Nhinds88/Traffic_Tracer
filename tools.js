const request = require('request');
const mysql = require("mysql");

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
    }
}