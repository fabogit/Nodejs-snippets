# Increasing stack trace size

A **stack trace**, sometimes referred to as a **stack backtrace**, is defined as a list of stack frames. When
your Node.js process hits an error, a stack trace is shown detailing the function that experienced the
error, and the functions that it was called by. By default, Node.js’s V8 engine will return 10 stack frames.

When debugging some errors, it can be useful to have more than 10 stack frames. However, increasing
the number of stack frames stored can come with a performance cost. Keeping track of additional
stack frames will result in our applications consuming more memory. For more details, you can refer
to this link: <https://v8.dev/docs/stack-trace-api>.

In `routes.js` the purpose of the `recursiveContent()` function is to force the creation of function calls, but
in larger, more complex applications, it’s possible to exceed the stack frame limit naturally.

Start by running the server:

```Bash
$ node server.js
Server listening on port 3000
```

Now, in a browser, navigate to <http://localhost:3000>. Alternatively, you could use
`cURL` to send a request to the endpoint.

We can now restart our application with the `--stack-trace-limit` flag. We’ll set this to `20`:

```Bash
$ node --stack-trace-limit=20 server.js
Server listening on port 3000
```

By extending how many stack frames are returned, we can see that the `recursiveContent()`
function is called in `routes.js` on _line 6_. This helps us realize that the reason our program is failing
is because we did not define the content and pass it to our `recursiveContent()` function.

We’ve learned how to return additional stack traces, and how these can help us to debug our applications.

## How it works…

Here, we make use of the `--stack-trace-limit` flag. This flag instructs the V8 JavaScript
engine to retain more stacks. When an error occurs, the stack trace will show the preceding function
calls up to the limit set with the flag. Here we extended this to `20` stack frames.

Note that it is also possible to set this limit from within your application code. The following line
would set the stack trace limit to 20:
`Error.stackTraceLimit = 20;`

It is also possible to set the stack trace limit to `Infinity`, meaning all preceding function calls will
be retained:
`Error.stackTraceLimit = Infinity`

Storing additional stack traces comes with a performance cost in terms of CPU and memory usage.
You should consider the impact this may have on your application.

### There’s more…

Asynchronous stack traces were added to Node.js 12 via the V8 JavaScript engine update; these can
help us debug our asynchronous functions.

Asynchronous stack traces help us to debug asynchronous functions in our programs.

In versions of Node.js before Node.js 12, the following stack trace would be returned from
the program:

```Bash
$ node async-stack-trace.js
Error: Fail
    at bar (/stack-trace-app/async-stack-trace.js:15:9)
    at process.runNextTicks [as _tickCallback] (internal/process/task_queues.js:52:5)
    at Function.Module.runMain (internal/modules/cjs/loader.js:880:11)
    at internal/main/run_main_module.js:21:11
(internal/bootstrap/node.js:623:3)
```

Observe that the trace just tells us the error is in the `bar()` function, followed by some internal
function calls, such as `process._tickCallback()`. Prior to Node.js 12, stack traces were
unable to effectively report the asynchronous function calls. Note that the stack frames do not
show that the `bar()` function was called by `foo()`.

However, thanks to an updated V8 engine, Node.js 12 and greater enable asynchronous stack
traces. We will now get the following stack output when we run the same program with Node.js 22:

```Bash
$ node async-stack-trace.js
Error: Fail
    at bar (/stack-trace-app/async-stack-trace.js:15:9)
    at async foo (stack-trace-app/async-stack-trace.js:9:3)
```

The stack traces in newer versions of Node.js can show us that the `bar()` function was called by an
asynchronous function named `foo()`.
