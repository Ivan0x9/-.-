var express = require('express');
var router = express.Router();
var user='a';
var pass='a';
/* GET users listing. */
router.post('/', function(req, res) {
 var username=req.body.username;
 var password=req.body.password;
 console.log(req.body);
   if(username==user && password ==pass){
       res.end('cool');
   }else{
       res.end('notcool');
   }


});

module.exports = router;