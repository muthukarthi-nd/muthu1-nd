const express = require('express');
const router = express.Router();
const {getUser} = require('../controller/transaction');

router.get('/v1', getUser);

module.exports = router;
