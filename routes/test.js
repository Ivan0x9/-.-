var express = require('express');
var router = express.Router();
var db = require('../lib/DB');
var pool=db.pool;
/* GET users listing. */
router.get('/', function(req, res, next) {

    pool.query("SELECT * FROM world.city", function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
    });


    if(req.sessval.user == "a"){
        res.send('cool');
    }else {


        res.render('test');

    }


});

module.exports = router;