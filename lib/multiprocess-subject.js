'use strict';

const Rx = require('rx');
const _ = require('lodash');

const getProcessSubject = require('./process-subject');

const getMultiprocessSubject = function (fileName, numProcesses) {
  let currentSubject = 0;

  const subjects = _.times(numProcesses, function () {
    return getProcessSubject(fileName);
  });

  const observer = Rx.Observer.create(function (data) {
    subjects[currentSubject].onNext(data);
    currentSubject = (currentSubject + 1) % numProcesses;
  }, function (e) {
    console.error('Error', e);
  }, function () {
    // console.log('Pushing Completed');
    subjects.forEach(function (subject) {
      subject.onCompleted();
    });
  });

  const observable = Rx.Observable.merge(subjects);

  const subject = Rx.Subject.create(observer, observable);

  return subject;
};

module.exports = getMultiprocessSubject;
