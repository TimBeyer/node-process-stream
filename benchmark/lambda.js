'use strict';

var processLambda = require('../index').processLambda;
var fib = require('./fib');

processLambda(fib);
