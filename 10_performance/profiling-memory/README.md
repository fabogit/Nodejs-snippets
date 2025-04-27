# Detecting memory leaks

Memory leaks can drastically reduce your application’s performance and can lead to crashes. V8
manages objects and dynamic data in its heap, a binary tree-based structure designed to manage
parent-child node relationships. The V8 **Garbage Collector (GC)** is responsible for managing the
heap. It reclaims any memory that is no longer in use – freeing the memory so that it can be reused.

A memory leak occurs when a block of memory is never reclaimed by the GC and is therefore idle
and inefficient. This results in pieces of unused memory remaining on the heap. The performance
of your application can be impacted when many of these unused memory blocks accumulate in the
heap. In the worst cases, the unused memory could consume all the available heap space, which, in
turn, can cause your application to crash.

Here we’ll learn how to use Chrome DevTools to profile memory, enabling us to detect and
fix memory leaks.

## How to do it…

Memory leaks can get progressively worse the longer an application is running. Sometimes, it
can take several days or weeks of an application running before the memory leak causes the
application to crash. We can use the Node.js process `--max-old-space-size` command-
line flag to increase or reduce the maximum V8 old memory size (in MB). To demonstrate the
presence of the memory leak, we’ll set this to a very small value. Start `leaky-server.js`
with the following command:

```Bash
$ node --max-old-space-size=10 leaky-server.js
Server listening on port 3000
```

In a second terminal window, use the autocannon tool to direct load to the server:

```Bash
$ autocannon http://localhost:3000
```

Back in the terminal window where you started the server, observe that the server crashed with
JavaScript heap out of memory:

```Bash
(node:64617) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 connection listeners added to [Server]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)

<--- Last few GCs --->
= [64617:0x568cf5fad000] 33012 ms: Mark-Compact (reduce) 9.4 (10.9) -> 9.0 (11.2) MB, pooled: 0 MB, 1.94 / 0.00 ms (+ 1.2 ms in 0 steps since start of marking, biggest step 0.0 ms, walltime since start of marking 7 ms) (average mu = 0.648, current mu = [64617:0x568cf5fad000] 33018 ms: Mark-Compact (reduce) 9.3 (11.2) -> 8.8 (11.4) MB, pooled: 0 MB, 1.25 / 0.00 ms (+ 1.8 ms in 0 steps since start of marking, biggest step 0.0 ms, walltime since start of marking 6 ms) (average mu = 0.605, current mu =

<--- JS stacktrace --->

FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
----- Native stack trace -----

1: 0x568cb9b780a9 node::OOMErrorHandler(char const*, v8::OOMDetails const&) [node]
2: 0x568cba0212f4 v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, v8::OOMDetails const&) [node]
3: 0x568cba0216c9 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, v8::OOMDetails const&) [node]
4: 0x568cba24e6bc [node]
5: 0x568cba2680c6 v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags) [node]
6: 0x568cba26d1d6 v8::internal::IncrementalMarkingJob::Task::RunInternal() [node]
7: 0x568cb9e37ae8 node::PerIsolatePlatformData::RunForegroundTask(std::unique_ptr<v8::Task, std::default_delete<v8::Task> >) [node]
8: 0x568cb9e39884 node::PerIsolatePlatformData::FlushForegroundTasksInternal() [node]
9: 0x72606d729ec3 [/usr/lib/libuv.so.1]
10: 0x72606d7490a1 [/usr/lib/libuv.so.1]
11: 0x72606d7305a2 uv_run [/usr/lib/libuv.so.1]
12: 0x568cb9c84f57 node::SpinEventLoopInternal(node::Environment*) [node]
13: 0x568cb9df928b node::NodeMainInstance::Run(node::ExitCode*, node::Environment*) [node]
14: 0x568cb9df981e node::NodeMainInstance::Run() [node]
15: 0x568cb9d4c754 node::Start(int, char\*\*) [node]
16: 0x72606c835488 [/usr/lib/libc.so.6]
17: 0x72606c83554c __libc_start_main [/usr/lib/libc.so.6]
18: 0x568cb9c81415 _start [node]
fish: Job 1, 'node --max-old-space-size=10 le…' terminated by signal SIGABRT (Abort)
```

Now, we’ll start using Chrome DevTools to profile our application. First, we must restart the
server with the following command:

```Bash
$ node --inspect leaky-server.js
```

Navigate to <chrome://inspect> in Google Chrome and click **inspect** (underneath `leaky-server.js`).
This should open the Chrome DevTools interface.

Ensure you’re on the **Memory** tab and that **Heap snapshot** is selected. Click **Take snapshot**.

Return to your second terminal window and rerun the autocannon benchmark:
`$ autocannon http://localhost:3000`

Once the load test has been completed, return to your Chrome DevTools window. Return to
the **Profiles** interface of the **Memory** tab and take another snapshot

Note `MaxListenersExceededWarning` in the **Console** tab.

Now that we have two snapshots, we can use Chrome DevTools to compare them. To do this,
change the drop-down window from **Summary** to **Comparison**.

Observe that the constructors are now sorted by delta – the difference between two snapshots.
Expand the `(array)` constructor and the `(object elements) [ ]` object within it;

The expanded view indicates that there are masses of `connectionListener()` events
stemming from line 4 of `leaky-server.js`. If we take a look at that line, we’ll see that it
starts on the `server.on('connection',...` block. This is our memory leak. We’re
registering a listener for the connected event upon every request, causing our server to eventually
run out of memory. We need to move this event listener outside of our request handler function.

Close the Chrome DevTools window and then rerun the same experiment. Start the server with
`$ node --inspect server.js` and take a snapshot. In a second terminal window, direct
load to the server with `$ autocannon http://localhost:3000` and take another
snapshot. Now, when we compare the two, we’ll see that the `# Delta` value of the `(array)`
constructors has significantly reduced.

Observe that the `MaxListenersExceededWarning` warning is no longer appearing, indicating
that we’ve fixed our memory leak.

With that, we’ve learned how to take heap snapshots of our application, enabling us to diagnose a
memory leak in our application.

## How it works…

The V8 JavaScript engine is used by both Google Chrome and Node.js. The common underlying engine
means that we can use Chrome DevTools to debug and profile Node.js applications. To enable the
debugging client, we must pass the `--inspect` command-line flag to the node process. Passing this
flag instructs the V8 inspector to open a port that accepts WebSocket connections. The WebSocket
connection allows the client and V8 inspector to interact.

The V8 JavaScript engine retains a heap of all the objects and primitives referenced in our JavaScript
code. The JavaScript heap can be exposed via an internal V8 API (`v8_inspector`). Chrome
DevTools uses this internal API to provide tooling interfaces, including the **Memory Profiler** interface
we used.

We used the **Memory** interface of Chrome DevTools to take an initial heap snapshot of the server. This
snapshot is considered our baseline. Then, we generated load on the server using the `autocannon`
tool to simulate usage over time. For our server, the memory leak could be observed with the default
`autocannon` load (`10` connections for 10 seconds). Some memory leaks may only be observable
under considerable load; in these cases, we’d need to simulate a more extreme load on the server,
potentially for a longer period.

Once we directed the load to our server, we took a second heap snapshot. This showed how much
impact the load had on the heap size. Our second snapshot was much larger than the first, which is an
indication of a memory leak. The heap snapshot **Comparison** view can be utilized to identify which
constructors have the largest deltas.

From inspecting and expanding the `(array)` constructor, we found a long list of `connectionListener()`
events stemming from _line 4_ of our `leaky-server.js` file. This enabled us to
identify the memory leak. Note that the `(array)` constructor refers to an internal structure used
by V8. For a JavaScript array, the constructor would be named `Array`.

Once the memory leak has been identified and fixed, it’s prudent to rerun the test and confirm that
the new heap snapshot shows a reduction in deltas. The snapshot is still likely to be larger than the
initial baseline snapshot because of the load. However, it shouldn’t be as drastically large as it was
with our `leaky-server.js` file.

## There’s more…

In this recipe, when under load, `leaky-server.js` emitted `MaxListenersExceededWarning`
before crashing:

```Bash
$ node --max-old-space-size=10 leaky-server.js
Server listening on port 3000
(node:64617) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 connection listeners added to [Server]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit
```

By default, Node.js allows a maximum of `10` listeners to be registered for a single event. In `leaky-server.js`,
we were registering a new listener for each request. Once our application registered
the 11th request, it emitted `MaxListenersExceededWarning`. This is an early warning sign
of a memory leak. It’s possible to change the maximum number of listeners. To change the threshold
for an individual `EventEmitter` instance, we can use the `emitter.setMaxListeners()`
method. For example, to lower the maximum number of listeners on our server to `1`, we could change
`leaky-server.js` to the following:

```JavaScript
const http = require('node:http');

const server = http.createServer((req, res) => {
  server.setMaxListeners(1); // <-
  server.on('connection', () => { });
  res.end('Hello World!');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

Then, if we were to run the same experiment, we’d see the following error after just two event listeners
were registered:

```Bash
(node:16629) MaxListenersExceededWarning: Possible EventEmitter memory
leak detected. 2 connection listeners added to [Server]. Use emitter.
setMaxListeners() to increase limit
```

It’s also possible to use the `EventEmitter.defaultMaxListeners` property to change the
default maximum listeners for all `EventEmitter` instances. This should be done with caution as it
will impact all `EventEmitter` instances. You could use the following to set the `EventEmitter.defaultMaxListeners` value:

```JavaScript
require("events").EventEmitter.defaultMaxListeners = 15;
```

Note that `emitter.setMaxListeners()` will always take precedence over the global default
set via `EventEmitter.defaultMaxListeners`. Before raising the maximum threshold of
listeners, it’s worth considering whether you’re inadvertently masking a memory leak in your application.
