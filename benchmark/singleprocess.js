'use strict'

var _ = require('lodash');

var fib = require('./fib');

var start = Date.now();

_.times(2000, function () {
  return fib(30);
});

var end = Date.now();
console.log(end - start);
