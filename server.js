var express = require('express'),
    app     = express(),
    mysql   = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 1000, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'sportify',
    debug    :  false
});

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
    });
});
app.get('/:table/:id', function(req,res){});
app.post('/:table', function(req,res){});
app.put('/:table/:id', function(req,res){});
app.delete('/:table/:id', function(req,res){});


app.listen(8080);
console.log('Rest Demo Listening on port 8080');