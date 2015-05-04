var mysql   = require('mysql');
var pool    = mysql.createPool({
	connectionLimit : 1000, //important, we have to test the resistance.
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'sportify',
	debug    :  true
});

var events = "events",
	fields = "fields",
	sports = "sports";

function errorConnection(err,data,callback){
	console.error('CONNECTION error: ',err);	//for console debugging

	var error = new Error("CONNEXION error: ",err); //implement a code error for callback function
	data.statusCode = 503;
	error.prototype.code = err.code;

	callback(error,data);	//This remplace "return" in javascript, in the nodeJs convention
							//we have to make a callback function with err and data in parameters.
}
//* In case of error with the database. The module myqsql give us some err and err.code we can use
exports.fetchTable = function (table , callback){
	var data = {};

	pool.getConnection(function(err, connection) {
		if (err) {
			errorConnection(err,data,function(err,data){callback(err,data);})
		} else {

			connection.query('SELECT * FROM '+table+'', function(err, rows, fields) {
				if (err) {
					console.error("QUERY error: ",err);

					var error = new Error("QUERY error: ",err);
					data.statusCode = 500;
					error.prototype.code = err.code;

					callback(error,data);
				} else{
					data.rows = rows;
					data.length = rows.length;
					connection.release();
					callback(null,data);
				}
			});

		}
	});
};

exports.addEvent = function(sport, field, date, callback){
	var data = {};
	console.log(date);
	pool.getConnection(function(err, connection) {
		if (err) {
			errorConnection(err,data,function(err,data){callback(err,data);})
		} else {
			var query ="";
			if(date == null){
				query = 'INSERT INTO '+events+'(installationSportive,sport) VALUES('+field+','+sport+')';
			}else{
				query = 'INSERT INTO '+events+'(installationSportive,sport,date) VALUES('+field+','+sport+','+date+')';
			}
			connection.query(query, function(err, rows, fields) {
				if (err) {
					console.error("QUERY error: ",err);

					var error = new Error("QUERY error: ",err);
					data.statusCode = 500;
					// error.prototype.code = err.code;

					callback(error,data);
				} else{
					// data.rows = rows;
					// data.length = rows.length;
					connection.release();
					callback(null,data);
				}
			});

		}
	});
};
exports.fetchFilteredEvents = function(filter,arg){
	pool.getConnection(function(err, connection) {
		if (err) {
			errorConnection(err,data,function(err,data){callback(err,data);})
		} else {
			connection.query("SELECT * FROM "+events+" WHERE "+filter+" = '"+arg+ "'", function(err, rows, fields) {
				if (err) {
					console.error("QUERY error: ",err);

					var error = new Error("QUERY error: ",err);
					data.statusCode = 500;
					error.prototype.code = err.code;
				}else {
					data.rows = rows;
					data.length = rows.length;
					connection.release();
					callback(null,data);
				}
			});
		}
	});
};
