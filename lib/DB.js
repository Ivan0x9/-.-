var mysql =  require('mysql');
var pool =  mysql.createConnection({
    connectionLimit : 100,
    host     : 'localhost',
    //port     : '4000',
    user     : 'imrsic',
    password : 'mojalozinka',
    database : 'iemdb'

});

pool.connect(function(err) {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('DB dignut');
});



module.exports.pool = pool;