var mysql = require('mysql');
mySqlClient = mysql.createConnection({
  host     : "localhost",
  user     : "user",
  password : "password",
  database : "mysqlTest"
});

var db = {
	"client" = mySqlClient,
	/**
	 * Retrieve all IDs
	 * callback is called with (err, events)
	 */
	"eventFetchAll": function fetchAll (callback) {
	  	// code javascript +  mySQL pour récupérer les données
	  	var selectQuery = 'SELECT * FROM test';

		var sqlQuery = mySqlClient.query(selectQuery);

	  	// on stocke le résultat de la requête dans un var results par exemple
		var results;

		sqlQuery.on("result", function(row) {
		  console.log('myField1: ' + row.myField1);
		  console.log('myField2: ' + row.myField2);

		  //code pour mettre chaque row dans results etc
		});

		sqlQuery.on("end", function() {
		  mySqlClient.end();
		  // on ferme le client et on renvoie dans notre fonction de callback (une sorte de return ) le resultats
		  callback(undefined, results);
		});

		sqlQuery.on("error", function(error) {
		  console.log(error);
		  // en cas d'erreur on renvoie à notre fonction de callback l'erreur
		  callback(error)
		});

	  });
	},

	// NOTE : la fonction de callback passé en paramètre dans les méthodes de manipulation des données auront la signature
	// function(err,result). Elles seront appelés dans app.js et on pourra gérer les erreurs à renvoyer au client ainsi.

	//exemple d'autre méthode a réaliser pour les requêtes sur les évênements
	"eventSave":      function eventSave (event, callback) { callback('Not implemented yet'); },
	"eventFetchOne":  function eventFetchOne (id, callback) { callback('Not implemented yet'); },
	"eventDeleteOne": function eventDeleteOne (id, callback) { callback('Not implemented yet'); },
	"eventDeleteAll": function eventDeleteAll (callback) { callback('Not implemented yet'); }
};

