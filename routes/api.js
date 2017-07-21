var express = require('express');
var router = express.Router();

var user='a';
var pass='a';
/* GET users listing. */
router.post('/login', function(req, res) {
 //ka fol provjerio bazu
    var username=req.body.username;

    var password=req.body.password;
 //ide dat sesiju
 console.log(req.body);

   if(username==user && password ==pass){
       req.sessval.user= "a";
       res.end('cool');
   }else{
       res.end('notcool');
   }


});

router.post('/register',function(req,res){
    console.log(req.body);


});

module.exports = router;