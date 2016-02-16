# node-process-stream

## Usage

### Consumer
```javascript
const multiprocessSubject = require('node-process-stream').multiprocessSubject;
const NUM_WORKERS = 4;

// Source stream
const source = Rx.Observable.repeat({
  data: 30
}, 2000);

// Set up subject to stream data through workers
const subject = multiprocessSubject(require.resolve('./lambda'), NUM_WORKERS);

// Listen to results
const subscription = subject.subscribe(function (message) {
  console.log(message.result);
});

// Connect source with worker subject and start processing data
source.subscribe(subject);
```

### Worker
```javascript
const processLambda = require('node-process-stream').processLambda;
const doWork = require('./do-work');  // Sync or promise

processLambda(function (data) {
  return doWork(data);
});
```
