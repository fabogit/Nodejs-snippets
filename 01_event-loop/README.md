# Introducing the Node.js event loop

The Node.js event loop is a fundamental concept in Node.js that enables it to perform asynchronous
and non-blocking operations efficiently. It’s a mechanism that’s responsible for managing the execution
of code in an event-driven environment. Understanding the Node.js event loop is crucial for building
scalable and responsive applications, especially when dealing with input/output-bound tasks such
as reading files, making network requests, or handling multiple client connections simultaneously.

## How Node.js works

Node.js operates in a single-threaded environment, meaning it uses a single main thread of execution
for your JavaScript code. However, Node.js can still handle many concurrent operations by leveraging
asynchronous, non-blocking I/O.

Node.js is event-driven, which means it relies on events and callbacks to execute code in response to
various actions or events. Events can be I/O operations (for example, reading files or making network
requests), timers, or custom events triggered by your code.

There are some key concepts to understand about Nsode.js’s handling of I/O:

- **Non-blocking:** Node.js not waiting for each operation to complete before moving on is referred
  to as non-blocking. Node.js can handle multiple tasks concurrently, making it highly efficient
  for I/O-bound operations.

- **Event queue:** When you perform an asynchronous operation, such as reading a file, Node.js
  doesn’t block the entire program. Instead, it puts these operations in a queue known as the
  event queue and continues with other tasks.

- **Event loop:** The event loop keeps running and checking the event queue. If there’s an operation
  in the queue that has completed (for example, a file has finished being read), it will execute a
  callback function associated with that operation.

- **Callback functions:** When an asynchronous operation is initiated, you usually provide a callback
  function. This function gets called when the operation is finished. For example, if you’re reading
  a file, the callback function will handle what to do with the file’s contents once it’s available.

`libuv` (<https://libuv.org/>) serves as the underlying library that powers the Node.js event
loop by providing a platform-agnostic, efficient, and concurrent I/O framework. It enables Node.
js to achieve its non-blocking, asynchronous nature while maintaining compatibility across various
operating systems.

## The Event Loop

The Node.js event loop operates a flow of phases. Deeply understanding this flow is important when
it comes to debugging, performance, and making the most of Node.js’ non-blocking approach.

When the Node.js process starts, the event loop is initialized and the input script is processed. The event
loop will continue until nothing is pending in the event loop or `process.exit()` is explicitly called.

The event loop phases are as follows:

- **Timers phase**: This phase checks for any scheduled timers that need to be executed. These
  timers are typically created using functions such as `setTimeout()` or `setInterval()`.
  If a timer’s specified time has passed, its callback function is added to the I/O polling phase.

- **Pending callbacks phase:** In this phase, the event loop checks for events that have completed
  (or errored) their I/O operations. This includes, for example, filesystem operations, network
  requests, and user events. If any of these operations have been completed, their callback functions
  are executed during this phase.

- **Idle and prepare phases:** These phases are rarely used in typical application development and
  are typically reserved for special use cases. The idle phase runs callbacks that are scheduled to
  execute during the idle period, whereas the prepare phase is used to prepare for poll events.

- **Poll phase:** The poll phase is where most of the action happens in the event loop. It performs
  the following tasks:

  - Checks for new I/O events (for example incoming data on a socket) and executes their
    callbacks if any are ready.
  - If no I/O events are pending, it checks the callback queue for pending callbacks scheduled
    by timers or `setImmediate()`. If any are found, they are executed.
  - If there are no pending I/O events or callbacks, the event loop may enter a blocking state
    waiting for new events to arrive. This is called “polling.”

- **Check phase:** In this phase, callbacks registered with `setImmediate()` are executed. Any
  callbacks are executed after the current poll phase but before any I/O callbacks.

- **Close callbacks phase:** This phase is responsible for executing close event callbacks, such as
  those registered with the `socket.on('close', ...)` event.

After completing all these phases, the event loop checks if there are any pending timers, I/O operations,
or other events. If there are, it goes back to the appropriate phase to handle them. Otherwise, if there
are no further pending events, the Node.js process ends.

`process.nextTick()` is not detailed in the phases. This is because `process.nextTick()`
schedules the provided callback function to run on the next tick of the event loop. Importantly,
this callback function is executed with higher priority than other asynchronous operations. The
`process.nextTick()` callback is executed after the current phase of the event loop is complete
but before the event loop moves on to the next phase. This allows you to schedule tasks so that they
run with higher priority, making it useful for ensuring that certain functions run immediately after
the current operation.
