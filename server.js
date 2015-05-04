var express = require('express'),
	app     = express(),
	bodyParser = require('body-parser'),
	database = require("./database.js");


/**  METHOD REST
GET		/tableName		Retrieve all lines
GET		/tableName/id	Retrieve the line with the specified _id
POST	/tableName		Add a new line
PUT		/tableName/id	Update line with the specified _id
DELETE	/tableName/id	Delete the line with the specified _id
**/

app.get("/",function(req,res) {
	res.send("bienvenue");
	console.log("bienvenue");
});

app.get('/fetch/:table', function(req,res){
	// res.setHeader({ 'Content-Type': 'application/json' });

	database.listAnyTable(req,res);
});

app.get('/fetch/:table/:id', function(req,res){
	// pool.getConnection(function(err, connection) {
	// 	if (err) {
	// 		console.error('CONNECTION error: ',err);
	// 		res.statusCode = 503;
	// 		  res.send({
	// 			result: 'error',
	// 			err:    err.code
	// 		});
	// 	} else {
	// 		// query the database using connection
	// 		if(req.params.table.toLowerCase() == 'users'){


	// 		}else{
	// 			connection.query("SELECT * FROM "+req.params.table+" WHERE id = '"+req.params.id+ "'", function(err, rows, fields) {
	// 				if (err) {
	// 					console.error(err);
	// 					res.statusCode = 500;
	// 					res.send({
	// 						result: 'error',
	// 						err:    err.code
	// 					});
	// 				}
	// 				res.send({
	// 					result: 'success',
	// 					err:    '',
	// 					json:   rows,
	// 					length: rows.length
	// 				});
	// 				connection.release();
	// 			});

	// 		}
	// 	}
	// });
});

app.get('/fetch/events/:filter/:arg', function(req,res){
	// pool.getConnection(function(err, connection) {
	// 	if (err) {
	// 		console.error('CONNECTION error: ',err);
	// 		res.statusCode = 503;
	// 		  res.send({
	// 			result: 'error',
	// 			err:    err.code
	// 		});
	// 	} else {
	// 		// query the database using connection
	// 		if(req.params.filter.toLowerCase() == 'sport'){
	// 			connection.query('SELECT * FROM events WHERE '+req.params.filter+" = '"+req.params.arg+ "'", function(err, rows, fields) {
	// 				if (err) {
	// 					console.error(err);
	// 					res.statusCode = 500;
	// 					res.send({
	// 						result: 'error',
	// 						err:    err.code
	// 					});
	// 				}
	// 				res.send({
	// 					result: 'success',
	// 					err:    '',
	// 					json:   rows,
	// 					length: rows.length
	// 				});
	// 				connection.release();
	// 			});
	// 		}else{


	// 		}
	// 	}
	// });
});

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.post('/:table', function(req,res){
	//To post somes parameters in post request need to use req.body.nameofparameters like this :
	//var name = req.body.name
	if(req.params.table.toLowerCase() == 'users'){
		//addUser(req,res) to implement

	}else if (req.params.table.toLowerCase() == 'events'){
	// 	pool.getConnection(function(err, connection) {
	// 		if (err) {
	// 			console.error('CONNECTION error: ',err);
	// 			res.statusCode = 503;
	// 			  res.send({
	// 				result: 'error',
	// 				err:    err.code
	// 			});
	// 		} else {
	// 			//addEvent(req,res) to implement
	// 			var reqField = req.body.field;
	// 			var reqDate = req.body.date;
	// 			var reqSport = req.body.sport;

	// 			var post  = {installationSportive: reqField, date: reqDate, sport: reqSport};
	// 			var query = connection.query('INSERT INTO'+req.params.table+' SET ?', post, function(err, result) {
	// 	  			if(!err){
	// 	  				res.send("you got it");
	// 	  			}
	// 			});
	// 		}
	// 	});
	// }else{
	// 	//Throw an error.... you can add every shit
	// }
	}

});
app.put('/:table/:id', function(req,res){
	if(req.params.table.toLowerCase() == 'users'){
		//updateUser(req,res) to implement
	}else if (req.params.table.toLowerCase() == 'events'){
		//updateEvent(req,res) to implement
	}else{
		//envoi un code d'erreur
	}
});
app.delete('/:table/:id', function(req,res){
	if(req.params.table.toLowerCase() == 'users'){
		//deleteUser(req,res) to implement
	}else if (req.params.table.toLowerCase() == 'events'){
		//deleteEvent(req,res) to implement
	}else{
		//envoi un code d'erreur
	}
});

// pool.on('connection', function (connection) {
//   connection.query('SET SESSION auto_increment_increment=1')
// });

app.listen(8080);
console.log('Rest Demo Listening on port 8080');