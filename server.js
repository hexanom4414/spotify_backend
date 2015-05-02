var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    mysql   = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 1000, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'sportify',
    debug    :  false
});


/**  METHOD REST
GET		/tableName		Retrieve all lines
GET		/tableName/id	Retrieve the line with the specified _id
POST	/tableName		Add a new line
PUT		/tableName/id	Update line with the specified _id
DELETE	/tableName/id	Delete the line with the specified _id
**/

app.get('/:table', function(req,res){
	// res.setHeader({ 'Content-Type': 'application/json' });
	pool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            // query the database using connection
        	if(req.params.table.toLowerCase() == 'events'){
				//Construire une requete special qui recupère toutes les infos de la table event et aussi ajoute
				//le nombre de personne inscrit à l'event et...à voir.

        	}else{
	            connection.query('SELECT * FROM '+req.params.table+'', function(err, rows, fields) {
	                if (err) {
	                    console.error(err);
	                    res.statusCode = 500;
	                    res.send({
	                        result: 'error',
	                        err:    err.code
	                    });
	                }
	                res.send({
	                    result: 'success',
	                    err:    '',
	                    json:   rows,
	                    length: rows.length
	                });
	                connection.release();
	            });

        	}
        }
    });
});

app.get('/:table/:id', function(req,res){
	pool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            // query the database using connection
        	if(req.params.table.toLowerCase() == 'users'){
				//Construire une requete special qui recupère toutes les infos de la table event et aussi ajoute
				//le nombre de personne inscrit à l'event et...à voir.

        	}else{
	            connection.query("SELECT * FROM "+req.params.table+" WHERE id = '"+req.params.id+ "'", function(err, rows, fields) {
	                if (err) {
	                    console.error(err);
	                    res.statusCode = 500;
	                    res.send({
	                        result: 'error',
	                        err:    err.code
	                    });
	                }
	                res.send({
	                    result: 'success',
	                    err:    '',
	                    json:   rows,
	                    length: rows.length
	                });
	                connection.release();
	            });

        	}
        }
    });
});
app.get('/events/:filter/:arg', function(req,res){
	pool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            // query the database using connection
			if(req.params.filter.toLowerCase() == 'sport'){
				connection.query('SELECT * FROM events WHERE '+req.params.filter+" = '"+req.params.arg+ "'", function(err, rows, fields) {
	                if (err) {
	                    console.error(err);
	                    res.statusCode = 500;
	                    res.send({
	                        result: 'error',
	                        err:    err.code
	                    });
	                }
	                res.send({
	                    result: 'success',
	                    err:    '',
	                    json:   rows,
	                    length: rows.length
	                });
	                connection.release();
	            });
        	}else{


        	}
        }
    });
});

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.post('/:table', function(req,res){
	//Pour récupérer les paramètres envoyer en post c'est un peu différent faut utiliser req.body comme ça :
	//var name = req.body.name
	if(req.params.table.toLowerCase() == 'users'){
		//addUser(req,res) to implement
	}else if (req.params.table.toLowerCase() == 'events'){
		//addEvent(req,res) to implement
	}else{
		//envoi un code d'erreur
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


app.listen(8080);
console.log('Rest Demo Listening on port 8080');