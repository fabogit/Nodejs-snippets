# Enabling debug logs

`debug` is a popular library, used by many popular frameworks, including the Express.js web framework
and the Mocha test framework. `debug` is a small JavaScript debugging utility based on the debugging
technique used in Node.js runtime itself. It offers a straightforward and flexible way to manage debug
logs, allowing you to enable or disable debugging dynamically, without altering your application code.
By using `debug`, you can selectively control logging for different parts of your application, making
it easier to diagnose issues and understand application flow.

To turn on debug logging, start your server with the following command:
`$ DEBUG=* node server.js`

Navigate to <http://localhost:3000> in your browser to send a request to our server.
You should see that the log messages describing your request have been output:

```Bash
  express:router dispatching GET / +1s
  express:router query  : / +1ms
  express:router expressInit  : / +0ms
```

Now, we can also filter which debug logs are output. We’ll filter it to just see the Express.js router
actions. To do this, restart your server with the following command:
`$ DEBUG=express:router* node server.js`

It’s possible to instrument your code with the `debug` module. We can do that by extending
our program.

Start your application with the following command, and then navigate to
<http://localhost:3000>. Expect to see our `HTTP GET request to /` log message in your
terminal window:

```Bash
$ DEBUG=my-server node debug-server.js
Server listening on port 3000
my-server HTTP GET request to / +0ms
```

Note that our log message has `my-server` prepended to it. This is the namespace for our log
messages, which we declared when we created our debug logging function.

We’ve now learned how to enable debug logs on our application. We’ve also learned how to filter the logs.

## How it works…

We first prepend `DEBUG=*` to our start command. This syntax passes an environment variable named `DEBUG`
to our Node.js process, which can be accessed from within the application via `process.env.DEBUG`.

We set the value to `*` , which enables all logs. Later, we filter out logs by setting
`DEBUG=express:router*`. Internally, the `debug` module converts the values we set to
regular expressions.

Express.js uses the `debug` module internally to instrument its code.

The default debug configuration is not suitable for logging in production. The default debug logs are
intended to be human-readable, hence the color coding. When in production, you should pass your
process the `DEBUG_COLORS=no` value to remove the ANSI codes that implement the color coding.
This will make the output more easily machine-readable.
