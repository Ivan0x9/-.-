var mysql =  require('mysql');
var pool =  mysql.createPool({
    connectionLimit : 100,
    host     : 'https://otoci.eu/phpmyadmin',
    port     : '4000',
    user     : 'imrsic',
    password : 'mojalozinka',
    database : 'iemdb'

});
console.log('DB dignut');

module.exports.pool = pool;