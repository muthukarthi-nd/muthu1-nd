const express = require('express');
const router = express.Router();
const {getUser} = require('../controller/transaction');

router.get('/userdata', getUser);

module.exports = router;
