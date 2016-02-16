'use strict';

const childProcess = require('child_process');
const Rx = require('rx');

const getProcessSubject = function (fileName) {
  const child = childProcess.fork(fileName);

  // Create observer to handle sending messages
  const observer = Rx.Observer.create(function (data) {
    // console.log('Got data', data);
    child.send(data);
  }, function (e) {
    console.error('Error', e);
  }, function () {
    child.send('completed');
    // console.log('Done Observer');
  });

  // Create observable to handle the messages
  const observable = Rx.Observable.create(function (obs) {
    child.on('message', function (data) {
      if (data === 'completed') {
        obs.onCompleted();
        return;
      }
      obs.onNext(data);
    });

    return function () {
      // console.log('Killing child process');
      child.kill('SIGINT');
    };
  });

  const subject = Rx.Subject.create(observer, observable);

  return subject;
};

module.exports = getProcessSubject;
