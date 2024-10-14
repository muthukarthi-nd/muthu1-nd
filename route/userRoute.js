var express = require('express');
var router = express.Router();
var {controller} =require('../controller/user');


router.post('/', controller);

module.exports = router;
