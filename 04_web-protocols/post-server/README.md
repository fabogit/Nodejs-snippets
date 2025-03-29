# Receiving HTTP POST requests

The HTTP `POST` method is employed for transmitting data to the server, in contrast to the HTTP
`GET` method, which is utilized to retrieve data.

To be able to receive `POST` data, we need to instruct our server on how to accept and handle `POST`
requests. A `POST` request typically contains data within the body of the request, which is sent to the
server to be handled. The submission of a web form is typically done via an HTTP `POST` request.

**Important note:**
In PHP, it is possible to access `POST` data via a `$_POST` array. PHP does not follow the
non-blocking architecture that Node.js does, which means that the PHP program would wait
or block until the `$_POST` values are populated. Node.js, however, provides asynchronous
interaction with HTTP data at a lower level, which allows us to interface with the incoming
message body as a stream. This means that the handling of the incoming stream is within the
developer’s control and concern.

## How it works…

The Node.js core `http` module is built on top of and interacts with the Node.js core `net` module.
The `net` module interacts with an underlying C library built into Node.js, called `libuv`. The `libuv`
C library handles network socket **input/output (I/O)** and handles the passing of data between the
C and JavaScript layers.

As in previous recipes, we call the `createServer()` function, which returns an HTTP server
object. Then, calling the `listen()` method on the server object instructs the `http` module to start
listening for incoming data on the specified address and port.

When the server receives an HTTP request, the `http` module will create objects representing the
HTTP request (`req`) and the HTTP response (`res`). After this, our request handler is called with
the `req` and `res` arguments.

Our route handler has the following `if` statements, which inspect each request to see if it is an HTTP
`GET` request or an HTTP `POST` request:

```JavaScript
http
  .createServer((req, res) => {
    if (req.method === 'GET') {
      get(res);
      return;
    }
    if (req.method === 'POST') {
      post(req, res);
      return;
    }
    error(405, res);
  })
  .listen(3000);
```

Our `get()` function sets the `Content-Type` HTTP header to `text/html`, as we’re expecting
to return an HTML form. We call the `res.end()` function to finish `WriteStream`, write the
response, and end the HTTP connection. Refer to Streams for more information on `WriteStream`.

Similarly, our `post()` function checks the `Content-Type` headers to determine whether we
can support the supplied values. In this instance, we only accept the `Content-Type` header of
`application/x-www-form-urlencode`, and our error function will be called if the request
is sent with any other content type.

Within our request handler function, we register a listener for the data event. Each time a chunk
of data is received, we convert it to a string using the `toString()` method and append it to our
input variable.

Once all the data is received from the client, the `end` event is triggered. We pass a callback function
to the end event listener, which gets called only once all data is received. Our callback logs the data
received and returns an `HTTP OK` status message.

### JSON Server

Node.js servers commonly allow interaction via JSON. Let’s look at how we can handle HTTP POST
requests that are sending JSON data. Specifically, this means accepting and handling content with the
application/json content type.

Let’s now test whether our server can handle the `POST` route. We will do this using the cURL
command-line tool. Start your server in one terminal window:

```Bash
$ node json-server.js
```

In a separate terminal window, enter the following command:

```Bash
$ curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"forename":"Ada","surname":"Lovelace"}' \
  http://localhost:3000/
{"data": {"forename":"Ada","surname":"Lovelace"}}%
```

Restart your JSON server with `$ node json-server.js` and navigate to <http://localhost:3000>
in your browser. If we now complete the input fields in our browser and submit
the form, we should see in the server logs that the request has been successfully sent to the server.
Note that our use of `event.preventDefault()` will prevent the browser from redirecting the
web page upon submission of the form.

Our form and server behave similarly to the server we created in `server.js`, with the difference being that the frontend form interacts with the backend via an HTTP `POST` request that sends a JSON representation of the form data. The client frontend interacting with the backend server via JSON is typical of modern web architectures.
