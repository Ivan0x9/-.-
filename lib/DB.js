var mysql =  require('mysql');
var pool =  mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    //port     : '4000',
    user     : 'imrsic',
    password : 'mojalozinka',
    database : 'iemdb'

});

pool.getConnection(function(err) {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('DB dignut');
});

/*var pool =  mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    port     : '4000',
    user     : 'root',
    password : 'root',
    database : 'iemdb'

});*/

console.log('DB dignut');


module.exports.pool = pool;