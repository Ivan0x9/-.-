var mysql =  require('mysql');
var pool =  mysql.createConnection({
    connectionLimit : 100,
    host     : 'localhost',
    port     : '4000',
    user     : 'imrsic',
    password : 'mojalozinka',
    database : 'iemdb'

});
console.log('DB dignut');

module.exports.pool = pool;