var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login', {
        id: 'register',
        item: 'Registracija'
    });
});

module.exports = router;
