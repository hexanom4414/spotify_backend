var mysql   = require('mysql');
var pool    = mysql.createPool({
	connectionLimit : 1000, //important, we have to test the resistance.
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'sportify',
	debug    :  true
});

exports.listAnyTable = function (req,res){

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

			//we authorize only all request about events, fields and sport table. Otherwise we're throwing
			//error for bad authorization access.
			if(!(req.params.table.toLowerCase() == 'events'|req.params.table.toLowerCase() == 'sports'
				|req.params.table.toLowerCase() == 'fields')){

				res.send({
					result:'error',
					err: 'No authorization access'
				});
				connection.release();
			}else{
				connection.query('SELECT * FROM '+req.params.table+'', function(err, rows, fields) {
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
							json:   rows,
							length: rows.length
						});
					}
						connection.release();
				});
			}
		}
	});

};
