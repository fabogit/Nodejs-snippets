# Working with worker threads

JavaScript is a single-threaded programming language, meaning that it executes one task at a time
within a process. Node.js also runs on a single thread, but it uses an event loop to handle asynchronous
operations, enabling non-blocking I/O calls. Despite this, the event loop processes one task at a time.
As a result, CPU-intensive tasks can block the event loop and degrade the overall performance of
your application.

To handle CPU-intensive tasks in Node.js efficiently, you should consider using worker threads.
Worker threads were declared stable in Node.js version 12 and later and are accessible through the
core `worker_threads` core module. The worker threads API allows you to run JavaScript code in
parallel across multiple threads, making it well-suited for CPU-intensive operations.

Now, run the program with the following command:

```Bash
$ node hello-worker.js
Hello User!
```

Now, let’s try something CPU-intensive and compare the behaviors when using and not using
worker threads.

Run the script with the following command:

```Bash
$ node fibonacci.js
The Fibonacci number at position 10 is 55
...
```

In this case, the `fibonacci()` function blocks the execution of `console.log("...");`
until the `fibonacci()` function has finished running.

Now, let’s try writing it using worker threads to see how we can avoid blocking the main thread.

Run this script with the following command:

```Bash
$ node fibonacci-worker.js
...
The Fibonacci number at position 10 is 55
```

Observe that `console.log("...");` is being printed before the result of the `fibonacci()`
function returns. The `fibonacci()` function has been offloaded to the worker thread,
meaning work on the main thread can continue.

With that, we’ve learned how to offload tasks to a worker thread using the Node.js core `worker_threads` module.

## How it works…

This recipe served as an introduction to worker threads. As we’ve seen, worker threads can be used to
handle CPU-intensive computations. Offloading CPU-intensive computations to a worker thread can
help avoid blocking the Node.js event loop. This means the application can continue to handle other
work – for example, I/O operations – while CPU-intensive tasks are being processed.

Worker threads are exposed via the core Node.js `worker_threads` module. To use a worker thread
in this recipe, we imported the following four assets from the `worker_threads` core module:

- `Worker`: The worker thread class, which represents an independent JavaScript thread.

- `isMainThread`: A property that returns `true` if the code isn’t running in a worker thread.

- `parentPort`: This is a message port that allows communication from the worker to the
  parent thread.

- `workerData`: This property clones the data that’s passed in the worker thread constructor.
  This is how the initial data from the main thread is passed to the worker thread.

In this recipe, we initialized a worker thread with the following code:

```JavaScript
  const worker = new Worker(__filename, {
    workerData: n,
  });
```

The `Worker` constructor requires a mandatory first argument – that is, a filename. This filename is
the path to the worker thread’s main script or module.

The second argument is an `options` object, which can accept many different configuration options. In
`fibonacci-worker.js`, we provided just one configuration option, `workerData`, to pass the value
of `n` to the worker thread. The full list of `options` that can be passed via the worker thread’s options
object is listed in the Node.js worker_threads API documentation
(<https://nodejs.org/api/worker_threads.html#worker_threads_new_worker_filename_options>).

Once the worker has been initialized, we can register event listeners on it. In this recipe, we registered
a message event listener function that executes every time a message is received from the worker. The
following events can be listened for on a worker:

- `error`: Emitted when the worker thread throws an uncaught exception

- `exit`: Emitted once the worker thread has stopped executing code

- `message`: Emitted when the worker thread emits a message using `parentPort.postMessage()`

- `messagerror`: Emitted when deserializing the message fails

- `online`: Emitted when the worker thread starts executing JavaScript code

We use `parentPort.postMessage()` to send the value of `fibonacci(n)` back to the parent
thread. In the parent thread, we register a message event listener to detect incoming messages from
the worker thread.

With that, we’ve introduced worker threads and showcased how they can be used to handle
CPU-intensive tasks.
