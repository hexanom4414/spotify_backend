var res = require('./response');
var db  = exports.db = require('./db')();
var app = require('express');
var app = express();

//** CODE de base (bas niveau) sans framework en pur javascript **\\
// var http = require('http');
// var server = http.createServer(function(req, res) {
//   res.writeHead(200);
//   res.end('Salut tout le monde !');
// });
// server.listen(8080);
//
// on utilisera pas ça mais quelque chose de plus simple grace à express et le prototype créé dans response.js


//** GESTION DES ROUTES **\\
// exemple: l'application android fait une requête à notre web service. Il demande la liste des évênements (matches)
app.get('/events', function (req, res) {

  //Appel à une méthode fetchAll, spécifique à la table events, codé dans le fichier db importé
  db.eventFetchAll(function (err, ids) {  /* explication du pourquoi function(err, ids) dans le fichier db.js:46 */
    res.respond(err || ids /*le contenu de la reponse contient les ids des events ou bien une erreur quelconque*/),
     err ? 500 : 200);
  });

});

// exemple d'autre méthode d'accès correspondant au PUT , POST , DELETE des spécifications des webservice Restfull
//app.put();
//app.delete();
//app.post();

// NOTE : app.js c'est la "classe" principal, le main qui met tous les autres fichiers en commun,
// utilise express pour la gestion des routes et requete faite par le client (android,iOS,web)
// récupère la requete la passe à une méthode de db.js adéquate
// et insère la réponse récupérer de la méthode de db.js avec l'objet response personnalisé dans le fichier response.js
// et inséré également dans app.js

app.on('close', db.close); // Close open DB connection when server exits