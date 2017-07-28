var express = require('express');
var router = express.Router();
var db = require('../lib/DB');
var pool=db.pool;


/* GET users listing. */
router.post('/PUSHPROJECT',function(req,res) {

    //console.log(req.body);
    //console.log(req.sessval.id);
    var IBANSlock=req.body.IBANS.length;
    var IBANSLIMIT=IBANSlock;
    var IBANSlock2;
    var IBANSlock3;
    var IBANSlock4;
    var IBANSlock5;

    //console.log('IBANSLIMIT ' + IBANSLIMIT);
    var IBANS=[];
    var KATEGORIJE= ['Ljudski resursi','Putovanja','Oprema i roba','Ostali troškovi i usluge','Troškovi obavljanja osnovne djelatnosti','Budžetni prihodi', 'Nepovezani budžet'];

    for(var j=0;j<IBANSLIMIT;j++){
        if(req.body.IBANS[j].value != 'X' && req.body.IBANS[j].value != undefined) {

            IBANS.push(req.body.IBANS[j].value);
        }
    }
   // console.log('IBANS');
    //console.log(IBANS);
   // console.log(IBANS.length);



    var IBANStypeIN= [];
    var IBANStypeOUT= [];
    var projid;
    var i;
    var sql1 = [
        "INSERT INTO projekt SET ime=?,datumpoc=?,datumkraj=?,iznos=?,id_korisnik=?",
    ].join('');
    var inserts1 = [req.body.name, req.body.start, req.body.end, req.body.budget, req.sessval.id];
    pool.query(sql1, inserts1, function (error, results, fields) {
        if (error) throw error;
        projid = results.insertId;
       // console.log('Projid'+ projid);
        if(IBANS.length==0){
            finishEverything();
        }else {
            for (var i = 0; i < IBANSLIMIT; i = i + 1) {
                checkINOUT(i);
            }//end of for
        }
    });

    var checkINOUT=function(k){

        var sql2 = [
            "SELECT * FROM br_rac WHERE IBAN=? AND id_korisnik=?",
        ].join('');
        var inserts2 = [req.body.IBANS[k].value, req.sessval.id];
        pool.query(sql2, inserts2, function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                var IBANSobject ={IBANS: IBANS[k], insertId: results[0].id_br_rac};
                IBANStypeIN.push(IBANSobject);
                IBANSlock -=1;
                //console.log(req.body.IBANS[i].value + 'postoji');
                if(IBANSlock===0){
                    finishrequest();
                }

            } else {
                var IBANSobjectno ={IBANS: IBANS[k], insertId: ''};
                IBANStypeOUT.push(IBANSobjectno);
                IBANSlock -=1;
                //console.log(req.body.IBANS[i].value + 'ne postoji');
                if(IBANSlock===0){
                    finishrequest();
                }
            }
        });
    };

    var finishrequest = function(){
        //console.log('GOTOVO');
        //console.log(IBANStypeIN);
       // console.log(IBANStypeOUT);
        var IBANSYESREPEAT=IBANStypeIN.length;
        if(IBANSYESREPEAT==0){
            finishYES();
        }else {
            IBANSlock2 = IBANSYESREPEAT;
            for (var j = 0; j < IBANSYESREPEAT; j++) {
                checkYES(j);
            }
        }
    };

    var checkYES=function(k){
        var sql3 = [
            "INSERT INTO rac_proj SET id_br_rac=?,id_projekt=?",
        ].join('');
        var inserts3 = [IBANStypeIN[k].insertId, projid];
        pool.query(sql3, inserts3, function (error, results, fields) {
            if (error) throw error;

            IBANSlock2 -= 1;

            if (IBANSlock2 === 0) {

                finishYES();
            }


        });

    };

    var finishYES= function(){
       // console.log('YES DONE');
        var IBANSINSERTREPEAT=IBANStypeOUT.length;
        if(IBANSINSERTREPEAT==0){
            finishEverything();
        }else {
            IBANSlock3 = IBANSINSERTREPEAT;
            for (var l = 0; l < IBANSINSERTREPEAT; l++) {
                insertNEWIBANS(l, IBANSlock3);
            }
        }
    };

    var insertNEWIBANS=function(k,timeout){
        var sql4 = [
            "INSERT INTO br_rac SET IBAN=?,id_korisnik=?",
        ].join('');
        var inserts4 = [IBANStypeOUT[k].IBANS, req.sessval.id];
        pool.query(sql4, inserts4, function (error, results, fields) {
            if (error) throw error;
            IBANStypeOUT[k].insertId = results.insertId;
            timeout -= 1;
            //console.log(req.body.IBANS[i].value + 'postoji');
            if (timeout === 0) {
                finishNO();
            }


        });


    };

    var finishNO = function (){
        //console.log('INSERT DONE');
        //console.log(IBANStypeOUT);
        var IBANSINSERTREPEAT=IBANStypeOUT.length;
        IBANSlock4=IBANSINSERTREPEAT;
        for(var o=0;o<IBANSINSERTREPEAT;o++) {
            insertRACNO(o, IBANSlock4);
        }
    };


    var insertRACNO=function(k,timeout){
        var sql5 = [
            "INSERT INTO rac_proj SET id_br_rac=?,id_projekt=?",
        ].join('');
        var inserts5 = [IBANStypeOUT[k].insertId, projid];
        pool.query(sql5, inserts5, function (error, results, fields) {
            if (error) throw error;
            timeout -= 1;
            //console.log(req.body.IBANS[i].value + 'postoji');
            if (timeout === 0) {
                finishEverything();
            }


        });


    };
    var finishEverything = function(){
       // console.log('Over!');

        var KATLENGTH=KATEGORIJE.length;
        IBANSlock5=KATLENGTH;
        for(var ko=0;ko<KATLENGTH;ko++) {
            insertKAT(ko, IBANSlock5);
        }
        res.send('success');
    };

    var insertKAT=function(k){
        var sql6 = [
            "INSERT INTO kategorija SET naziv=?,id_projekt=?",
        ].join('');
        var inserts6 = [KATEGORIJE[k], projid];
        pool.query(sql6, inserts6, function (error, results, fields) {
            if (error) throw error;



        });


    };



});





router.post('/GETIBANS',function(req,res){


    var sql = [
        "SELECT * FROM br_rac WHERE br_rac.id_korisnik=?",
    ].join('');
    var inserts = [req.sessval.id];
    pool.query(sql, inserts, function (error, results, fields) {
        if (error) throw error;

        //console.log(results);
        if (results.length > 0) {

            //sending errors

            res.send(results);

        } else {

            res.send('failure');

        }


    });





});



router.post('/IBAN',function(req,res){
   // console.log(req.sessval.user);



       var sql = [
           "SELECT * FROM br_rac WHERE br_rac.id_korisnik=? AND br_rac.IBAN=?",
       ].join('');
       var inserts = [req.sessval.id, req.body.IBAN];
       pool.query(sql, inserts, function (error, results, fields) {
           if (error) throw error;

           // console.log(results);
           if (results.length > 0) {

               //sending errors

               res.send('success');

           } else {

               res.send('failure');

           }


       });






});






router.post('/login', function(req, res) {
 //ka fol provjerio bazu


    var sql = [
        "SELECT username,email,password,id_korisnik FROM korisnik WHERE (korisnik.username =? OR korisnik.email=?) AND password=?",
    ].join('');
    var inserts = [req.body.username,req.body.username,req.body.password];
    pool.query(sql,inserts, function (error, results, fields) {
        if (error) throw error;

        //console.log(results);
        if( results.length  > 0){

            //sending errors
            req.sessval.user= req.body.username;
            req.sessval.id= results[0].id_korisnik;
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