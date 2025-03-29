# Using Web Protocols

Node.js was built with web servers in mind. Using Node.js, we can quickly create a web server with
a few lines of code, allowing us to customize the behavior of our server.

**HTTP** stands for **HyperText Transfer Protocol** and is an application layer protocol that underpins
the **World Wide Web (WWW)**I. HTTP is a stateless protocol that was originally designed to facilitate
communication between web browsers and servers. The recipes in this chapter will have a large emphasis
on how to handle and send HTTP requests. Although the recipes do not require a deep understanding
of how HTTP operates, it would be worthwhile reading a high-level overview if you’re completely
new to the concept. MDN Web Docs provides an overview of HTTP at
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview>.

This chapter will showcase the low-level core **application programming interfaces (APIs)** that
Node.js provides for interacting with web protocols. We’ll start by making HTTP requests, creating
an HTTP server, and learning how to handle POST requests and file uploads. Later in the chapter,
we will learn how to create a WebSocket server and how to create a **Simple Mail Transfer Protocol (SMTP)**
server using Node.js.

It’s important to understand how Node.js interacts with underlying web protocols, as these web
protocols and fundamental concepts form the basis of most real-world web applications.

## Making HTTP requests

Programs and applications often need to obtain data from another source or server. In modern web
development, this is commonly achieved by sending an HTTP `GET` request to the source or server.
Similarly, an application or program may also need to send data to other sources or servers. This is
often achieved by sending an HTTP `POST` request containing the data to the target source or server.

As well as being used to build HTTP servers, the Node.js core `http` and `https` modules expose
APIs that can be used to send HTTP requests to other servers.

**Important note:**
Postman (<http://postman.com>) is a platform for API development and provides a
Representational State Transfer (REST) client application that you can download to use to
send HTTP requests. Postman also provides a service named Postman Echo – this provides
an endpoint that you can send your HTTP requests to for testing. Refer to the Postman Echo
documentation here: <https://docs.postman-echo.com/?version=latest>.

In `requests.js` we leveraged the Node.js core `http` module to send HTTP `GET` and HTTP `POST`
requests. The Node.js core http module relies on the underlying Node.js core `net` module.

For the HTTP `GET` request, we call the `http.get()` function with two parameters. The first parameter
is the endpoint that we wish to send the request to, and the second is the callback function. The callback
function executes once the HTTP `GET` request is complete, and in this recipe, our function forwards
the response we receive from the endpoint to `stdout`.

To make the HTTP `POST` request, we use the `http.request()` function. This function also takes
two parameters.

The first parameter to the `request()` function is the `options` object. In the recipe, we used the
options object to configure which HTTP method to use, the hostname, the path the request should
be sent to, and the headers to be set on the request. A full list of configuration options that can be
passed to the `request()` function is viewable in the Node.js HTTP API documentation
(<https://nodejs.org/api/http.html#http_http_request_options_callback>).

The second parameter to the `request()` function is the callback function to be executed upon
completion of the HTTP `POST` request. Our request function writes the HTTP status code and
forwards the request’s response to standard output (`stdout`).

An error event listener was added to the request object to capture and log any errors to stdout:

```JavaScript
req.on('error', (err) => console.error('Error: ', err));
```

The `req.end(payload);` statement sends our request with the payload.

**Promise:**

It’s also possible to combine this API with `Promise` syntax:

```JavaScript
import { get } from 'node:http';

function httpGet(url) {
	return new Promise((resolve, reject) => {
		get(url, (res) => {
			let data = '';
			res.on('data', (chunk) => {
				data += chunk;
			});
			res.on('end', () => {
				resolve(data);
			});
		}).on('error', (err) => {
			reject(err);
		});
	});
}

const run = async () => {
	const res = await httpGet('http://example.com');
	console.log(res);
};

run();
```

The `httpGet()` function uses a `Promise` to manage an asynchronous HTTP `GET` request: it
resolves with the full data on successful completion and rejects with an error if the request fails. This
setup allows for easy integration with `async/await` for handling asynchronous HTTP operations.

---

The recipe demonstrated how to send `GET` and `POST` requests over HTTP, but it is also worth
considering how to send requests over HTTPS. **HTTPS** stands for **HyperText Transfer Protocol Secure**.
HTTPS is an extension of the HTTP protocol. Communications over HTTPS are encrypted.
Node.js core provides an `https` module, alongside the `http` module, to be used when dealing with
HTTPS communications.

It is possible to change the requests in the recipe to use HTTPS by importing the https core
module and changing any instances of `http` to `https`. You also will need to send the request to the
HTTPS endpoint:

```JavaScript
const https = require('node:https');
https.get('https://example.com', ...);
https.request('https://example.com', ...);
```

Having covered the basics with the traditional HTTP and HTTPS modules for making requests, let’s
pivot to explore how to use `Promise` syntax and the more recently added Fetch API.

## Using the Fetch API (fetchGet.js & fetchPost.js)

Let’s explore the **Fetch API**, a modern web API designed for making HTTP requests. While it has
been available in browsers for some time, it has more recently become available by default in Node.js.
In Node.js, the Fetch API is a higher-level alternative to the core HTTP modules, offering a simplified
and user-friendly abstraction over lower-level HTTP APIs. It embraces a `Promise`-based approach
for handling asynchronous operations.

Starting from Node.js version 18, the Fetch API is readily available as a global API. The implementation
in Node.js is powered by `undici`, an HTTP/1.1 client developed from scratch specifically for Node.
js. You can find more information about `undici` at <https://undici.nodejs.org/#/>.

The implementation was inspired by the frequently used `node-fetch`
(<https://npmjs.com/package/node-fetch>) package. The Node.js implementation of the Fetch API strives to be as
close to specification-compliant as possible, but some aspects of the Fetch API specification are more
browser-oriented and are therefore omitted in the Node.js implementation.

**Important note:**
You can directly use `undici` as a module for lower-level and more fine-grained control of
handling HTTP requests. Read the `undici` API documentation for more information:
<https://undici.nodejs.org/#/>.

As the implementation of the Fetch API in Node.js intends to be as compatible with the specification
as possible, you can refer to _MDN Web Docs_ for more detailed usage information:
<https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API>. MDN Web Docs provides
a comprehensive and often considered canonical resource for web developers.

**Important note:**
It’s advisable to stay informed about updates and changes to its status as Node.js may release newer
versions that refine the Fetch API implementation. Refer to the API documentation:
<https://nodejs.org/dist/latest-v22.x/docs/api/globals.html#fetch>.
