var express = require('express');
var router = express.Router();
var db = require('../lib/DB');
var pool=db.pool;

var user='a';
var pass='a';
/* GET users listing. */
router.post('/login', function(req, res) {
 //ka fol provjerio bazu


    var sql = [
        "SELECT username,email,password FROM korisnik WHERE (korisnik.username =? OR korisnik.email=?) AND password=?",
    ].join('');
    var inserts = [req.body.username,req.body.username,req.body.password];
    pool.query(sql,inserts, function (error, results, fields) {
        if (error) throw error;

        console.log(results);
        if( results.length  > 0){

            //sending errors
            req.sessval.user= req.body.username;
                res.send('cool');


        }else {
            res.send('Rejected');


        }


    });




});

router.post('/register',function(req,res){

    //searching for avaliable username

  var sql = [
      "SELECT username,email FROM korisnik WHERE korisnik.username =? OR korisnik.email=?",
  ].join('');
  var inserts = [req.body.userName,req.body.userEmail];
 pool.query(sql,inserts, function (error, results, fields) {
      if (error) throw error;

      if( results.length  > 0){

          //sending errors
          if(results[0].username==req.body.userName){
                res.send('errorusername')

          }else{
                res.send('erroremail');

          }

      }else{
        //registering
          var sql = [
              "INSERT INTO korisnik SET",
              " ime=?",
              ",prezime=?",
              ",email=?",
              ",password=?",
              ",username=?",
              ",firma=?",
              ",transemail=?",
          ].join('');
          var inserts = [req.body.firstName, req.body.lastName, req.body.userEmail, req.body.password, req.body.userName, req.body.companyName, req.body.transactionEmail];
          pool.query(sql, inserts, function (error, results, fields) {
              if (error) throw error;

          });


          res.send('success');

          res.end();


      }
  });




});

module.exports = router;