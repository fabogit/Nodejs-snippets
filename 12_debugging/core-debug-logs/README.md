# Enabling Node.js core debug logs

When debugging some problems in your applications, it can be useful to have insight into the internals
of Node.js and how it handles the execution of your program. Node.js provides debug logs that we
can enable to help us understand what is happening internally in Node.js.

These core debug logs can be enabled via an environment variable named `NODE_DEBUG`. Here
we’re going to set the `NODE_DEBUG` environment variable to allow us to log internal Node.js behaviors.

We just need to set the `NODE_DEBUG` variable to the internal flag we wish to log. The internal
flags align with specific subsystems of Node.js, such as timers or HTTP. To enable the “timer”
core debug logs, start your server with the following command:
`$ NODE_DEBUG=timer node server.js`

```Bash
TIMER 781854: no 30000 list was found in insert, creating a new one
Server listening on port 3000
TIMER 781854: no 3000 list was found in insert, creating a new one
TIMER 781854: process timer lists 3292
TIMER 781854: timeout callback 3000
Server listening...
TIMER 781854: 3000 list wait because diff is -1
TIMER 781854: process timer lists 6297
TIMER 781854: timeout callback 3000
Server listening...
TIMER 781854: 3000 list wait because diff is 0
```

Observe the additional log output from our program. We can see additional information about
our `setInterval()` function, which is executed every 3,000 ms.

The preceding `TIMER` log statements are additional debug information that derives from the
internal implementation of timers in Node.js core, which can be found at
<https://github.com/nodejs/node/blob/master/lib/internal/timers.js>.

We will now enable core debug logs for the `http` module. Restart your server with the
following command:
`$ NODE_DEBUG=http node server.js`

Navigate to <http://localhost:3000> in a browser. You should expect to see internal
logs about your HTTP request output:

```Bash
Server listening on port 3000
Server listening...
HTTP 782642: SERVER new http connection
(node:782642) Warning: Setting the NODE_DEBUG environment variable to 'http' can expose sensitive data (such as passwords, tokens and authentication headers) in the resulting log.
(Use `node --trace-warnings ...` to show where the warning was created)
HTTP 782642: SERVER socketOnParserExecute 567
HTTP 782642: write ret = true
HTTP 782642: outgoing message end.
HTTP 782642: server socket close
HTTP 782642: SERVER new http connection
HTTP 782642: SERVER socketOnParserExecute 567
HTTP 782642: write ret = true
HTTP 782642: outgoing message end.
HTTP 782642: server socket close
Server listening...
HTTP 782642: SERVER new http connection
HTTP 782642: SERVER new http connection
HTTP 782642: outgoing message end.
HTTP 782642: SERVER socketOnParserExecute 676
Server listening...
```

We’ve now learned how to use the `NODE_DEBUG` environment variable to enable the logging of
Node.js internals.

## How it works…

In the recipe, we set the `NODE_DEBUG` environment variable to both the `timer` and `http` subsystems.
The `NODE_DEBUG` environment variable can be set to the following Node.js subsystems:

- `child_process`

- `cluster`

- `esm`

- `fs`

- `http`

- `https`

- `http2`

- `module`

- `net`

- `repl`

- `source_map`

- `stream`

- `test_runner`

- `timer`

- `tls`

- `worker`

It is also possible to enable debug logs on multiple subsystems via the `NODE_DEBUG` environment
variable. To enable multiple subsystem logs, you can pass them as a comma-separated list. For example,
to enable both the http and timer subsystems, you’d supply the following command:
`$ NODE_DEBUG=http,timer node server.js`

The output of each log message includes the subsystem/namespace, followed by the **process identifier(PID)**,
and then the log message.

Here, we first enabled the “timer” core debug logs. In our program, we have a `setInterval()`
function that prints the **Server listening...** message to `stdout` every 3,000 ms. The core debug logs
provided insight into how our interval timer was created internally.

Similarly, when we enabled the `http` core module debug logs, we could follow what was happening
internally during HTTP requests. The `http` debug logs are fairly self-explanatory and human-readable
in terms of how they describe the actions that are happening when our server receives and responds
to an HTTP request.

**Extending NODE_DEBUG:**
It is possible to make use of the Node.js core `util.debuglog()` method to instrument your
own debug logs that you can enable via the `NODE_DEBUG` environment variable. However,
this is not generally recommended. It is preferable to use the third-party `debug` module.
The `debug` module provides additional logging features, including timestamps and color-coding, with minimal overhead.
