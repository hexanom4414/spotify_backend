var mysql   = require('mysql');
var pool    = mysql.createPool({
	connectionLimit : 1000, //important, we have to test the resistance.
	host     : 'localhost',
	user     : 'root',
	password : 'sportify!',
	database : 'sportify',
	debug    :  true
});

var Max_id ;

var events = "evenement",
	fields = "installationSportive",
	sports = "sport",
	users  = "utilisateur";

function errorConnection(err,data,callback){
	console.log('CONNECTION error: ',err);	//for console debugging

	var error = new Error("CONNEXION error: ",err); //implement a code error for callback function
	data.statusCode = 503;
	// error.code = err.code;

	callback(error,data);	//This remplace "return" in javascript, in the nodeJs convention
							//we have to make a callback function with err and data in parameters.
}

function errorQuery(err,data,callback){
	console.log("QUERY error: ",err);

	var error = new Error("QUERY error: ",err);
	data.statusCode = 500;
	// error.code = err.code;
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
					errorQuery(err,data,function(err,data){callback(error,data);});
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

exports.addEvent = function(table,sport, field, date, email, callback){
	var data = {};
	console.log(date);
	pool.getConnection(function(err, connection) {
		if (err) {
			errorConnection(err,data,function(err,data){callback(err,data);});
		} else {
			var sQuery1 ="";
			var sQuery2 ="SELECT id FROM utilisateur WHERE email ="+email;

			var userId;
			var eventId;
			if(date == null){
				sQuery1 = "INSERT INTO "+table+" (sportId, installationId, email_createur) \
				 VALUES ( '"+sport+"','"+field+"','"+email+"')"
			}else{
				sQuery1 = "INSERT INTO "+table+" (sportId, installationId, date_evenement, email_createur) \
				VALUES ('"+sport+"','"+field+"','"+date+"','"+email+"')";
			}
			var query = connection.query(sQuery1+";"+sQuery2);
			query.on('error', function(err) {
					errorQuery(err,data,function(err,data){callback(error,data);});
			});
			query.on('result',function(row){
				eventId = row[0].insertId;
				userId  = row[1].insertId;
			});
			query.on('end',function(rows){

				pool.getConnection(function(err, connection) {
					if (err) {
						errorConnection(err,data,function(err,data){callback(err,data);})
					} else {
						var sQuery ="INSERT INTO jonction_evenement_utilisateur(utilisateurId, evenementId) \
						VALUES ("+userId+","+eventId+")";

						connection.query(sQuery,function(err,rows,fields){
							if (err) {
								errorQuery(err,data,function(err,data){callback(error,data);});
							}else {
								connection.release();
								callback(null,data);
							}
						});
					}
				});
			});

		}
	});
};
exports.fetchFilteredTable = function(table,filter,arg){
	var data = {};
	pool.getConnection(function(err, connection) {
		if (err) {
			errorConnection(err,data,function(err,data){callback(err,data);})
		} else {
			connection.query("SELECT * FROM "+table+" WHERE "+filter+" = '"+arg+ "'", function(err, rows, fields) {
				if (err) {
					errorQuery(err,data,function(err,data){callback(error,data);});
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
	var data = {};

	pool.getConnection(function(err, connection) {
		if (err) {
			errorConnection(err,data,function(err,data){callback(err,data);});
		} else {
			connection.query("SELECT * FROM "+table+" WHERE id = '"+id+ "'", function(err, rows, fields) {
				if (err) {
					errorQuery(err,data,function(err,data){callback(error,data);});
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

exports.createUser = function (email,firstname,lastname, callback){
	var data = {};
	pool.getConnection(function(err, connection) {
		if (err) {
			errorConnection(err,data,function(err,data){callback(err,data);});
		} else {
			var sQuery1 ="";
			var sQuery2 ="SELECT * FROM utilisateur WHERE email ="+email;

			var q2_result;
			sQuery1 = "INSERT INTO utilisateur (email, nom, prenom) \	VALUES ('"+email+"' ,'"+firstname+"','"+lastname+"')";
			
			var query = connection.query(sQuery2);
			query.on('error', function(err) {
					errorQuery(err,data,function(err,data){callback(error,data);});
			});
			query.on('result', function(row) {
					q2_result=row;

			});
			query.on('end',function(rows){
				if(false){
					var error = new Error("USER ALREADY IN DATABASE");
					callback(error,data);

				}else{
					pool.getConnection(function(err, connection) {
						if (err) {
							errorConnection(err,data,function(err,data){callback(err,data);})
						} else {

							console.log("______________USERS Creeeeated______________");
							connection.query(sQuery1,function(err,rows,fields){
								if (err) {
									console.log("____________  error db__________");
									errorQuery(err,data,function(err,data){callback(error,data);});
								}else {
									connection.release();
									callback(null,data);
								}
							});
						}
					});
				}
			});

		}
	});
	
	// var create =false;

	// var requete_get_user="SELECT * FROM "+users+''+"\
	//  WHERE nom = '"+firstname+ "'" + " AND prenom = '"+lastname+"'" + " AND email = '"+email+"'";
	// pool.getConnection(function(err, connection) {
	// 	if (err) {
	// 		errorConnection(err,data,function(err,data){callback(err,data);})

	// 	} else {

	// 		var query = connection.query(requete_get_user, function(err, rows, fields) {
	// 			if (err) {
	// 				errorQuery(err,data,function(err,data){callback(error,data);});
	// 			} else{
	// 				console.log(rows.length);
	// 				if (rows.length==0){
	// 					create =true;
	// 				}
	// 				connection.release();
	// 			}

	// 		});

	// 		query.on('end', function(rows){
	// 			// connection.release();

	// 			pool.getConnection(function(err, connection) {
	// 				if (err) {
	// 					errorConnection(err,data,function(err,data){callback(err,data);})

	// 				} else {
	// 					if (create){

	// 						var request_insert_user="INSERT INTO utilisateur (email, nom, prenom) \
	// 						VALUES ('"+email+"' ,'"+nom+"','"+prenom+"')";
	// 						console.log("----------------"+request_insert_user+"----------------");
	// 						connection.query(request_insert_user, function(err, rows, fields) {
	// 							if (err) {
	// 								errorQuery(err,data,function(err,data){callback(error,data);})
	// 							} else{
	// 								connection.release();
	// 								callback(null,data);
	// 							}
	// 						});
	// 					}else{
	// 						var error = new Error("USER ALREADY IN DATABASE");
	// 						callback(error,data);
	// 					}
	// 				}
	// 			});

	// 		});

	// 	}
	// });

};

