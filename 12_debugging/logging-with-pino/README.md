# Logging with Node.js

**Logging** is a crucial tool for understanding the inner workings of an application. By strategically
placing log statements throughout your code, you can gain valuable insights into the behavior and
state of your application at various points in its execution. This is particularly useful when diagnosing
issues, as logs can provide a retrospective view of what was happening just before a crash or failure –
helping you identify the root cause more efficiently.

Beyond troubleshooting, logging serves multiple purposes. For instance, you can use logs to collect
and analyze data about your application’s usage patterns. By logging every access to the endpoints of
your web application, you can aggregate these logs to identify the most frequently visited endpoints.
This information can help you optimize performance, improve user experience, and make informed
decisions about future development priorities.

Here we will delve into logging with **Pino** (<https://www.npmjs.com/package/pino>),
a high-performance JSON-based logger that is both fast and lightweight. Pino is particularly
well suited for Node.js applications, offering a streamlined way to produce structured logs that are
easy to parse and analyze. We will cover how to set up Pino, integrate it into your application, and
use it to generate meaningful logs.

Pino’s default log level is `info`. This means that messages logged with `debug` will not appear unless you change the log
level to `debug` or lower.

Run this in your terminal:

```Bash
$ node log.js
{"level":30,"time":1746386222942,"pid":743427,"hostname":"Garuda","msg":"This is an info message"}
{"level":40,"time":1746386222943,"pid":743427,"hostname":"Garuda","msg":"This is a warning message"}
{"level":50,"time":1746386222943,"pid":743427,"hostname":"Garuda","msg":"This is an error message"}
{"level":20,"time":1746386222943,"pid":743427,"hostname":"Garuda","msg":"This is a debug message"}
```

Let’s make the output look more readable. To do this, we can use pino-pretty:

```Bash
$ node log.js | npx pino-pretty
npm warn exec The following package was not found and will be installed: pino-pretty@13.0.0
[21:18:58.666] INFO (745001): This is an info message
[21:18:58.667] WARN (745001): This is a warning message
[21:18:58.667] ERROR (745001): This is an error message
[21:18:58.667] DEBUG (745001): This is a debug message
```

Back in your terminal, run the `logToFile.js` program, and once completed, you should
be able to see the message that has been written to the file:

```Bash
$ node logToFile.js
$ cat app.log
File: app.log
{"level":30,"time":1746386424874,"pid":746237,"hostname":"Garuda","msg":"This is an info message"}
```

Let’s demonstrate Pino’s log redaction: Pino allows you to redact sensitive information
from your logs to protect sensitive data. You can specify the paths of the properties to redact.

Run the redactLog.js file. We expect to see the password and IP values we specified redacted:

```Bash
$ node redactLog.js
{"level":30,"time":1746386718415,"pid":750755,"hostname":"Garuda","user":{"name":"Jane Doe","password":"[Redacted]","ip":"[Redacted]"},"msg":"User login"}
```

## How it works…

**Pino** is a highly performant and low-overhead logging library for Node.js, designed to be minimalistic
and fast, making it suitable for high-throughput applications. It outputs logs in a JSON format by
default, which facilitates easy parsing and compatibility with log processing systems. This structured
format includes essential details, such as timestamps, log levels, and the message content.

Here, we began with the integration of the Pino module, which is accomplished by installing
and then importing it into the application. Once Pino is integrated, a logger instance is instantiated.
This instance serves as the central mechanism through which all logging activities are conducted.
Using this logger, developers can generate logs at various severity levels. Each level allows the logger
to categorize messages by their importance, aiding in the quick identification and troubleshooting of
issues based on their severity. The possible log levels are as follows:

- `fatal`

- `error`

- `warn`

- `info`

- `debug`

- `trace`

### There’s more…

Pino can be integrated into various web frameworks using middleware, enhancing logging capabilities
with minimal effort. The `express-pino-logger` middleware, for example, adds a log object to
every incoming request in an Express.js application. This log object is accessible via a property named
`log` on the request object (`req.log`). Each log object is unique per request and contains data about
the request, including a unique identifier.

The following example demonstrates how Pino can be integrated into an Express.js application to
provide JSON logging:

```JavaScript
const express = require('express');
const pino = require('pino');
const expressPino = require('express-pino-logger');

const logger = pino();
const app = express();

app.use(expressPino({ logger }));

app.get('/', (req, res) => {
 req.log.info('Handling request');
 res.send('Hello World');
});

app.listen(3000, () => {
 logger.info('Server is running on port 3000');
});
```

In addition to Express.js, Pino can be integrated with other popular web frameworks through various
middlewares and plugins provided by the Pino GitHub organization:

- `express-pino-logger`: Express.js middleware for Pino, as used in the prior example (<https://github.com/pinojs/express-pino-logger>)

- `hapi-pino`: A Hapi plugin for Pino (<https://github.com/pinojs/hapi-pino>)

- `koa-pino`: A Koa.js middleware for Pino (<https://github.com/pinojs/koa-pino-logger>)

- `restify`: A Restify middleware for Pino (<https://github.com/pinojs/restify-pino-logger>)

Furthermore, Pino’s logging capability is built into the **Fastify** web framework, requiring only that
logging be enabled with a simple configuration:

```JavaScript
const fastify = require('fastify')({
  logger: true,
});
```
