/**
 * New node file
 */
var ejs = require('ejs'); //importing module ejs
var mysql = require('mysql'); //importing module mysql

var pool = mysql.createPool({
    connectionLimit : 600,
    host     : 'localhost',
    user     : 'root',
    password : '2994',
    port	 : 3306,
    database : 'ebay'
});

function getConnection(success,failure) {
	pool.getConnection(function(err, connection) {
		if (!err) {
			console.log("Database is connected");
			success(connection);
		} else {
			console.log("Error connecting database");
			failure("Error connecting database");
		}
    });
};

exports.run_aQuery = function(queryToRun, callbackRows){
	console.log("queryToRun = " + queryToRun);
	
	var connection = getConnection(function(connection){
		connection.query(queryToRun, function(err, res){
			 if (err) throw err;
			    else {
			    	callbackRows(err,res);
			    }
			});
		   console.log("\nConnection closed..");
		   connection.release();
	}, function(error){
		throw "Error: error connecting to db: " + error;
	});	
};
