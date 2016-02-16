'use strict';

const Bluebird = require('bluebird');

module.exports = function createLambda (lambdaFn) {
  const pid = process.pid;
  // console.log('Child process up', pid);

  let isCompleted = false;
  let totalMessages = 0;
  let totalProcessing = 0;
  let totalCompleted = 0;

  process.on('message', (message) => {
    if (message === 'completed') {
      isCompleted = true;
      return;
    }

    totalMessages = totalMessages + 1;
    totalProcessing = totalProcessing + 1;
    // console.log(`Total Procesing: ${totalProcessing}\nTotal Completed: ${totalCompleted}\nTotal Messages: ${totalMessages}`);

    Bluebird.method(lambdaFn)(message.data).then((response) => {
      message.response = response;
      totalCompleted = totalCompleted + 1;
      totalProcessing = totalProcessing - 1;
      message.pid = pid;
      message.timeStampResponse = Date.now();
      // console.log(message);

      process.send(message);
      if (isCompleted && (totalCompleted === totalMessages)) {
        process.send('completed');
        return;
      }
    });
  });

  process.on('SIGINT', () => {
    process.exit();
  });
};
