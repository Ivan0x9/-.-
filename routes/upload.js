var express = require('express');
var router = express.Router();
var formidable= require('formidable');
var db = require('../lib/DB');
var pool=db.pool;
var fs = require('fs');
var iconvlite = require('iconv-lite');

router.post('/', function(req, res) {

    var form = new formidable.IncomingForm();
    //console.log(form);
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = 'C:/Users/User2/WebstormProjects/EM-Project/uploads/' + files.filetoupload.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;

        });
        fs.exists(newpath, function(exists){
            if(exists){ // results true
               fs.readFile(newpath,function(err,data){
                 var  content=data;
                 var BANKA;
                 var IBAN;
                   //console.log(content);
                   var encoded  = iconvlite.decode(content, 'cp1250');





                   fs.writeFile('C:/Users/User2/Desktop/Nered/test.txt',encoded, function(err) {
                   if(err) {
                       return console.log(err);
                   }

                   console.log("The file was saved!");
               });
                console.log(encoded);
               });

                }

        });
        res.write('File uploaded and moved!');
        res.end();
    });





});

module.exports = router;