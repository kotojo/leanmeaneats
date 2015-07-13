'use strict';

var express = require('express');
var controller = require('./food.controller');

var router = express.Router();

router.get('/', controller.search);

module.exports = router;
