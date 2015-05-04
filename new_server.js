var express    = require('express'),
	bodyParser = require('body-parser'),
	database   = require("./database.js"),
	app        = express(),
	port       = 8080;

var events = "events",
	fields = "fields",
	sports = "sports",
	users  = "users";

app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');

app.get("/",function(req,res) {
	// res.render("index.js");
	// res.end('');
	var error = new Error("hello");
	console.log(error);
	res.send("Bienvenue sur SportifyWS bitchies");
})

.use( bodyParser.json() )       // to support JSON-encoded bodies
.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))


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
.get('/fetch/:table/:id', function(req,res){})
.get('/fetch/events/:filter/:arg', function(req,res){
	var filter = req.params.filter,
		arg    = req.params.arg;

	database.fetchFilteredEvents(filter,arg,function(err,data){
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
	})
})
.post('/:table', function(req,res){
	switch(req.params.table){
		case users:
			// database.addUser();
			break;
		case events:
			var sport = req.body.sport,
				field = req.body.field,
				date  = req.body.date ? null : new Date(req.body.date);

			database.addEvent(sport,field,date,function(err,data){
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