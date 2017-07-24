var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {


    res.render('project-template', {
        name: '{{project.name}}'
    });
});

module.exports = router;
