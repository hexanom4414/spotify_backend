var express    = require('express'),
	bodyParser = require('body-parser'),
	database   = require("./database.js"),
	app        = express(),
	port       = 80;

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var events = "evenenement",
	fields = "installationSportive",
	sports = "sport",
	users  = "utilisateur";

app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');

app.get("/",function(req,res) {
	// res.render("index.js");
	// res.end('');
	var error = new Error("hello");
	var filter = req.query.filter;
	var arg = req.query.arg;
	console.log(filter);
	console.log(arg);
	res.send("Bienvenue sur SportifyWS");
})

// .use( bodyParser.json() )       // to support JSON-encoded bodies
// .use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// }))


/***********************  METHOD REST  ****************************\
GET		/tableName		Retrieve all lines
GET		/tableName/id	Retrieve the line with the specified _id
POST	/tableName		Add a new line
PUT		/tableName/id	Update line with the specified _id
DELETE	/tableName/id	Delete the line with the specified _id
\******************************************************************/
.get('/fetch/:table', function(req,res){
	var table = req.params.table;

	database.fetchTable(table, function(err,data){
		if(err){
			res.statusCode = data.statusCode;
			res.send({
				success: false,
				err:    err.code
			});
		}else{
			res.send({
				success: true,
				data:   data.rows,
				length: data.length
			});
		}
	});

})
.get('/fetch/:table/:id', function(req,res){
	var table = req.params.table,
		id    = req.params.id;

	database.fetchElementById(table,id,function(err,data){
		if(err){
			res.statusCode = data.statusCode;
			res.send({
				success: false,
				err:    err.code
			});
		}else{
			res.send({
				success: true
			});
		}
	});
})
.get('/fetch/:table/:filter/:arg', function(req,res){
	var table  = req.params.filter,
		filter = req.params.filter,
		arg    = req.params.arg;

	database.fetchFilteredTable(table,filter,arg,function(err,data){
		if(err){
			res.statusCode = data.statusCode;
			res.send({
				success: false,
				err:    err.code
			});
		}else{
			res.send({
				success: true
			});
		}
	});
})
.post('/:table', urlencodedParser, function(req,res){
	switch(req.params.table){
		case users:
			var u_firstname =req.body.firstname;
			var	u_lastname =req.body.lastname;

			database.createUser(u_firstname,u_lastname, function(err,data){
				if(err){
					res.statusCode = data.statusCode;
					res.send({
						success: false,
						err:    err.code
					});
				}else{
					res.send({
						success: true
					});
				}
			});
			break;
		case events:
			console.log(req.body);
			var table = req.params.table,
				sport = req.body.sport,
				field = req.body.field,
				date  = req.body.date ? new Date().now() : new Date(req.body.date).getTime() ;

			database.addEvent(table,sport,field,date,function(err,data){
				if(err){
					res.statusCode = data.statusCode;
					res.send({
						success: false,
						err:    err.code
					});
				}else{
					res.send({
						success: true
					});
				}
			});
			break;
		default:
			res.send({
				success: false,
				err: new Error("CAN'T ADD ", req.params.table)
			});
	}
})
.put('/:table/:id', function(req,res){})
.delete('/:table/:id', function(req,res){})

//Send Error 404 if no routes upside work
.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});
app.listen(port);
console.log('WebService Sportify listening on port : '+port);