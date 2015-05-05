var mysql   = require('mysql');
var pool    = mysql.createPool({
	connectionLimit : 1000, //important, we have to test the resistance.
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'sportify',
	debug    :  true
});

var Max_id ;

var events = "events",
	fields = "fields",
	sports = "sports";

function errorConnection(err,data,callback){
	console.error('CONNECTION error: ',err);	//for console debugging

	var error = new Error("CONNEXION error: ",err); //implement a code error for callback function
	data.statusCode = 503;
	error.code = err.code;

	callback(error,data);	//This remplace "return" in javascript, in the nodeJs convention
							//we have to make a callback function with err and data in parameters.
}

function errorQuery(err,data,callback){
	console.error("QUERY error: ",err);

	var error = new Error("QUERY error: ",err);
	data.statusCode = 500;
	error.code = err.code;
	callback(error,data);
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
					errorQuery(err,data,function(err,data){callback(error,data);})
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
				query = "INSERT INTO "+events+" (installationSportive,sport) VALUES ('"+field+"','"+sport+"')";
			}else{
				query = "INSERT INTO "+events+" (installationSportive,sport,date) VALUES ('"+field+"','"+sport+"','"+date+"')";
			}
			connection.query(query, function(err, rows, fields) {
				if (err) {
					errorQuery(err,data,function(err,data){callback(error,data);})
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
					errorQuery(err,data,function(err,data){callback(error,data);})
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

exports.fetchElementById = function (table,id , callback){
	pool.getConnection(function(err, connection) {
		if (err) {
			errorConnection(err,data,function(err,data){callback(err,data);})
		} else {
			connection.query("SELECT * FROM "+table+" WHERE id = '"+id+ "'", function(err, rows, fields) {
				if (err) {
					errorQuery(err,data,function(err,data){callback(error,data);})
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

exports.createUser = function (req,res){
	var u_firstname =req.body.firstname;
	var	u_lastname =req.body.lastname;
	var requete_get_user="SELECT * FROM "+req.params.table+''+" WHERE firstname = '"+u_firstname+ "'" + " AND lastname = '"+u_lastname+"' ";
	pool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ',err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err:    err.code
			});
		} else {
				var create =false;
				connection.query(requete_get_user, function(err, rows, fields) {
					if (!err) {
						console.error(err);
						res.statusCode = 500;
						res.send({
							result: 'error',
							err:    err.code
						});
					} else{
						if (!rows){
							create =true;
						}		
					}
						connection.release();
				});
				if (create){

					if (!Max_id){
						connection.query( 'SELECT MAX(id) FROM '+req.params.table+'', function(err, rows, fields) {
											if (!err) {
												console.error(err);
												res.statusCode = 500;
												res.send({
													result: 'error',
													err:    err.code
												});
											} else{
												Max_id=	rows[0]+1;
												console.log("----------------"+Max_id+"----------------");
											}
												connection.release();
										});

					}else{Max_id++;}

					var request_insert_user="INSERT INTO users (id, firstname, lastname ) VALUES(" +Max_id+", '"+u_firstname+"' ,‘"+u_lastname+"')";
					console.log("----------------"+request_insert_user+"----------------");
					connection.query(request_insert_user, function(err, rows, fields) {
					if (!err) {
						console.error(err);
						res.statusCode = 500;
						res.send({
							result: 'error',
							err:    err.code
						});
					} else{
							res.send({
							result: 'success',
							err:    '',
							json:  null,
							length: 0
							});	
					}
						connection.release();
				});
				}else{

							res.send({
							result: 'error',
							err:    'USER EXITE',
							json:   null,
							length: 0
							});
				}
				
			
		}
	});

};

