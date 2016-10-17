
/*
 * GET home page.
 */
var mysql = require('./mysql');
var ejs = require("ejs");

exports.index = function(req, res){
	if(req.session.email_id){
		console.log("email_id = " + req.session.email_id);
		var getFirstname = "select firstname from users where email_id = '" + req.session.email_id + "'";
		mysql.run_aQuery(getFirstname, function(err, results) {
	        if (err) {
	            throw err;
	        } else {
	            if (results.length > 0) {
	            	res.render('userHome', { username: results[0].firstname });
	            }
	            else console.log("empty response from DB");
	        }
		});
	}
	else 
		res.render('signUp', { title: 'Ebay Sign Up' });
};