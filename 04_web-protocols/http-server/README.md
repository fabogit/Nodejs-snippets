# Creating an HTTP server

When building large complex applications, it is typical to implement HTTP servers using a higher-
level web framework rather than interacting with core Node.js APIs. However, understanding the
underlying APIs is important, and in some cases, only interacting with the underlying Node.js APIs
will provide you with the fine-grained control required in certain circumstances.

Run

```Bash
$ node server.js
Server listening on port 3000
```

In a separate terminal window, we can either use cURL to send `GET` requests to our server or
access the various endpoints in our browser:

```bash
$ curl http://localhost:3000/
{"name": "todo-server"}%
$ curl http://localhost:3000/todo
[{"task_id": 1, "description": "walk the dog"}]}%
$ curl -X DELETE http://localhost:3000/
{"error": "Method Not Allowed"}%
$ curl http://localhost:3000/not-an-endpoint
{"error": "Not Found"}%
```

## How it works…

The Node.js core `http` module provides interfaces to the features of the HTTP protocol.

In the recipe, we created a server using the `createServer()` function that is exposed by the `http`
module. We passed the `createServer()` function a request listener function that is executed
upon each request.

Each time a request is received to the specified route, the request listener function will execute. The
request listener function has two parameters, `req` and `res`, where `req` is the request object and `res`
is the response object. The `http` module creates the `req` object based on the data in the request.

It is possible to pass the `createServer()` function an `options` object as the first parameter.
Refer to the `http` module Node.js API documentation to see which parameters and options can be
passed to the various `http` functions: <https://nodejs.org/api/http.html>.

The `createServer()` function returns an `http.Server` object. We start the server by calling
the `listen()` function. We pass the `listen()` function our HOSTNAME and PORT parameters
to instruct the server which hostname and port it should be listening on.

Our request handler in the recipe is formed of three if statements. The first if statement checks the
`req.method` property for which HTTP method the incoming request was sent with:

```JavaScript
if (req.method !== 'GET') return error(res, 405);
```

In this recipe, we only allowed `GET` requests. When any other HTTP method is detected on the
incoming request, we return and call our error function.

The second two if statements inspect the `req.url` value:

```JavaScript
  if (req.url === '/todo') return todo(res);
  if (req.url === '/') return index(res);
```

The url property on the request object informs us which route the request was sent to. The `req.url`
property does not provide the full **Uniform Resource Locator (URL)**, just the relative path or
“route” segment. The `if` statements in this recipe control which function is called upon each request
to a specific URL – this forms a **simple route handler**.

The final line of our listener function calls our `error()` function. This line will only be reached if
none of our conditional `if` statements are satisfied. In our recipe, this will happen when a request is
sent to any route other than `/` or `/todo`.

We pass the response object, `res`, to each of our `error()`, `todo()`, and `index()` functions. This
object is a `Stream` object. We call `res.end()` to return the desired content.

For the `error()` function, we pass an additional parameter, `code`. We use this to pass and then
return HTTP status codes. HTTP status codes are part of the HTTP protocol specification
(<https://tools.ietf.org/html/rfc2616#section-10>). The following table shows how HTTP
response codes are grouped:

| Range | Use          |
| ----- | ------------ |
| 1xx   | Information  |
| 2xx   | Success      |
| 3xx   | Redirection  |
| 4xx   | Client error |
| 5xx   | Server error |

In the recipe, we returned the following error codes:

- 404 – `Not Found`

- 405 – `Method Not Allowed`

The `http` module exposes a constant object that stores all the HTTP response codes and their
corresponding descriptions: `http.STATUS_CODES`. We used this to return the response message
with `http.STATUS_CODE`.

In the recipe, we defined a constant for the `HOSTNAME` and `PORT` values with the following lines:

```JavaScript
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0';
const PORT = process.env.PORT || 3000;
```

The use of `process.env` allows the values to be set as environment variables. If the environmental
variables are not set, then our use of the OR logical operator (||) will mean our hostname and port
values default to `0.0.0.0` and `3000` respectively.

It’s a good practice to allow the hostname and port values to be set via environment variables as this
allows deployment orchestrators, such as Kubernetes, to inject these values at runtime.

It’s also possible to bind your HTTP server to a random free port. To do this, we set the PORT value
to 0. You can change our recipe code that assigns the PORT variable to the following to instruct the
server to listen to a random free port:

```JavaScript
const PORT = process.env.PORT || 0;
```

Binding to any random port in Node.js is useful when deploying on platforms that dynamically assign
ports (for example, cloud services) or in scenarios with potential port conflicts (for example, multiple
instances running simultaneously).

### Using --env-file

As of Node.js 20.6.0 and later, there is a new command-line option that can be used to load environment
variables from files. This provides similar functionality to the commonly used `npm` package `dotenv`
(<https://www.npmjs.com/package/dotenv>) by loading environment variables into
`process.env` from a file containing the environment variables.

Each line in the file should consist of a key-value pair representing an environment variable, with the
name and value separated by an equals sign (=). For example, you would add the following to define
the HOSTNAME and PORT variables to the default values used in the recipe:

```Env
HOSTNAME='0.0.0.0'
PORT=3000
```

Often, this file will be called `.env` for local development, but it is also common to have multiple
environment files representing different application environments, such as `.staging.env` for
environment values that correspond to the staging application of your development.

To load the values in the environment, you need to supply the --env-file command-line option:

```Bash
$ node --env-file=.env server.js
```

If the same variable is defined in the environment and the file, the value from the environment will
take precedence.

Note that at the time of writing, this feature is designated as Experimental status, meaning the feature
may be subject to breaking changes and/or removal. More details can be found in the official API
documentation at <https://nodejs.org/docs/latest-v22.x/api/cli.html#--env-fileconfig>.
