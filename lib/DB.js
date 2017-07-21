var mysql =  require('mysql');
var pool =  mysql.createPool({
    connectionLimit : 20,
    host     : 'localhost',
    port     : '4000',
    user     : 'root',
    password : 'root',
    database : 'world'

});
console.log('DB dignut');

module.exports.pool = pool;