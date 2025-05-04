# Creating diagnostic reports

The diagnostic report utility has been available behind a process flag since Node.js v11.8.0. The diagnostic
report utility allows you to generate a report containing diagnostic data on demand or when certain
events occur. The situations where a report could be generated include when your application crashes,
or when your application is experiencing slow performance or high CPU usage.

A diagnostic report fulfills a similar purpose to the Java Core file. The diagnostic report contains data
and information that can aid with diagnosing problems in applications. The information reported
includes the Node.js version, the event that triggered the report, stack traces, and more.

Historically, the diagnostic report utility was available as a `npm` module named `node-report`.
But, to improve adoption and enhance the core diagnostic features, it was merged into Node.js core.

Now, if we run the application, we should expect to see the following uncaught `ERR_INVALID_PROTOCOL` error:

```Bash
$ node server.js
node:_http_client:190
    throw new ERR_INVALID_PROTOCOL(protocol, expectedProtocol);
    ^

TypeError [ERR_INVALID_PROTOCOL]: Protocol "hello:" not supported. Expected "http:"
...
```

To enable the diagnostic report feature, we need to start the Node.js process with the `--report-uncaught-exception` flag.
Expect to see the following snippet included in the output,
showing that a report has been created:

```Bash
$ node --report-uncaught-exception server.js

node:_http_client:190
    throw new ERR_INVALID_PROTOCOL(protocol, expectedProtocol);
    ^

TypeError [ERR_INVALID_PROTOCOL]: Protocol "hello:" not supported. Expected "http:"
    at new ClientRequest (node:_http_client:190:11)
    at request (node:http:102:10)
    at Object.get (node:http:113:15)
    at Object.<anonymous> (/diagnostic-report/server.js:8:6)
    at Module._compile (node:internal/modules/cjs/loader:1554:14)
    at Object..js (node:internal/modules/cjs/loader:1706:10)
    at Module.load (node:internal/modules/cjs/loader:1289:32)
    at Function._load (node:internal/modules/cjs/loader:1108:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:220:24) {
  code: 'ERR_INVALID_PROTOCOL'
}

Writing Node.js report to file: my-diagnostic-report.json
Node.js report completed

Node.js v22.14.0
```

Now, we can take a look at the report. It should have been created in the reports directory
with the name `my-diagnostic-report.json`.

Identify the `event` and `trigger` property toward the top of the file and observe that it
provides details about the event that triggered the error:

```Json
{
  "event": "Exception",
  "trigger": "Exception",
}
```

Further down in the file, identify the `javascriptStack` property. It should provide the
stack trace of the error:

```Json
{
    "javascriptStack": {
        "message": "TypeError [ERR_INVALID_PROTOCOL]: Protocol \"hello:\" not supported. Expected \"http:\"",
    "stack": [
        "at new ClientRequest (node:_http_client:190:11)",
      "at request (node:http:102:10)",
      "at Object.get (node:http:113:15)",
      "at Object.<anonymous> (/diagnostic-report/server.js:8:6)",
      "at Module._compile (node:internal/modules/cjs/loader:1554:14)",
      "at Object..js (node:internal/modules/cjs/loader:1706:10)",
      "at Module.load (node:internal/modules/cjs/loader:1289:32)",
      "at Function._load (node:internal/modules/cjs/loader:1108:12)",
      "at TracingChannel.traceSync (node:diagnostics_channel:322:14)"
    ],
    "errorProperties": {
        "code": "ERR_INVALID_PROTOCOL"
    }
  },
}
```

Now, we’ve learned how to enable the diagnostic report utility on uncaught exceptions and how to
inspect the report for diagnostic information.

## How it works…

The diagnostic report utility enables a diagnostic summary to be written in a file on certain conditions.
The utility is built into the Node.js core and is enabled by passing one of the following command-line
flags to the Node.js process:

- `--report-uncaught-exception`: As used in the example, it triggers a crash on an
  uncaught exception.

- `--report-on-signal`: This is used to configure which signal a report is triggered upon,
  such as `SIGUSR1`, `SIGUSR2`, `SIGINT`, or `SIGTERM`. The default is `SIGUSR2`.

- `--report-on-fatalerror`: A report is triggered on a fatal error, such as an
  out-of-memory error.

Note that it is also possible to trigger the generation of the report from within your application using
the following line:

```JavaScript
process.report.writeReport();
```

In the example, we first set up a custom directory by assigning the `process.report.directory` and
`process.report.filename` variables in the program. These can also be set via the `--report-directory` and `--report-filename`
command-line arguments. Note that you may wish to append a timestamp to the filename – otherwise, the reports may get overwritten.

Neither the directory nor the filename are required to be set. When the directory is omitted, the report
will be generated in the directory from which we start the Node.js process. When omitting a specified
filename, the utility will default to creating one with the following naming convention:
`report.20181126.091102.8480.0.001.json`.
