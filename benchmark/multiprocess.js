'use strict';

const Rx = require('rx');

const getMultiprocessSubject = require('../index').multiprocessSubject;

let i = 0;
const source = Rx.Observable.repeat({
  data: 30
}, 2000).map(function (value) {
  value.timeStampRequest = Date.now();
  value.id = i++;
  return value;
}).publish().refCount();

let done = 0;
const start = Date.now();
const subject = getMultiprocessSubject(require.resolve('./lambda'), 4);
const subscription = subject.publish().refCount().subscribe(function (x) {
  let now = Date.now();

  done = done + 1;

  // console.log(now - start);
  // console.log(done);
  // console.log(x);
  // console.log('Message took', now - x.timeStampRequest, 'ms');
}, function (e) {
  console.error('Error', e);
}, function () {
  var now = Date.now();

  console.log(`Calculation took ${now - start}`);
  process.exit();
});

source.subscribe(subject);
