const request = require('request');
const mysql = require("mysql");

module.exports = {
/**
 * Return random image URLs from an api
 * @param string keyword - search term
 * @param int   imageCount - number of random images
 * @return array of image URLs
 * */
    // getRandomImages: function (keyword,imageCount){
    //     var requestURL = "https://api.unsplash.com/photos/random?query="+keyword+"&count="+imageCount+"&client_id=5e244509372fe153e4f571a4e992c0828f6ca481adfbca1ebbbd93365dc2a9ca&orientation=landscape";
        
    //     return new Promise( function(resolve, reject){
    //       request(requestURL, function (error, response, body) {

    //             if (!error){
    //               var parseData = JSON.parse(body);
    //               var imageURLs = [];
                  
    //               for (let i = 0; i < imageCount; i++) {
    //                   imageURLs.push(parseData[i].urls.regular);
    //               }
    //               console.log(imageURLs)
    //               resolve(imageURLs);
    //             } else {
                    
    //                 console.log("error", error);
    //             }
    //         });//request  
    //     })
    // },//function
    
    // getRandomImages_cb: function (keyword, imageCount, callback){
    //     var requestURL = "https://api.unsplash.com/photos/random?query="+keyword+"&count="+imageCount+"&client_id=5e244509372fe153e4f571a4e992c0828f6ca481adfbca1ebbbd93365dc2a9ca&orientation=landscape";
        
    //     request(requestURL, function (error, response, body) {
            
    //         if (!error){
    //           var parseData = JSON.parse(body);
              
    //           var imageURLs = [];
                  
    //           for (let i = 0; i < imageCount; i++) {
    //               imageURLs.push(parseData[i].urls.regular);
    //           }
    //           console.log(imageURLs)
    //           callback(imageURLs);
    //         } else {
                    
    //             console.log("error", error);
    //         }
    //     });//request  
    // }, //function
    
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

// createConnection = () => mysql.createPool({
//     connectionLimit: 100000,
//     host: "localhost:3306", 
//     user: "root",
//     password: "Delonh88",
//     database: "traffictracer"
// });

// const connection = createConnection();
// module.exports.query = (sql, sqlParams = []) => new Promise((resolve, reject) => {
//   connection.getConnection((err, connection) => {
//       if (err) return reject(err);

//       connection.query(sql, sqlParams, (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       });
//   });
// });