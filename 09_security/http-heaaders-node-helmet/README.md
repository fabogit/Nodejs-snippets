# Hardening headers with Helmet

`Express.js` is a lightweight web framework, so certain measures that are typically taken to better secure
applications are not implemented by the core framework. One of the precautionary measures we can
take is to set certain security-related HTTP headers on requests. Sometimes, this is referred to as
hardening the headers of our HTTP requests.

The `Helmet` module (<https://github.com/helmetjs/helmet>) provides a middleware to
set security-related headers on our HTTP requests, saving time on manual configuration. Helmet
sets HTTP headers to reasonable and secure defaults, which can then be extended or customized as
needed.

Let’s inspect the default headers that our `Express.js` application returns. We can do this using the
`cURL` tool. Wile the server is running, in a second terminal window, enter the following command:

```Bash
curl -I http://localhost:3000
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 12
ETag: W/"c-Lve95gjOVATpfV8EL5X4nxwjKHE"
Date: Fri, 18 Apr 2025 16:05:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

Enabling helemet we can see that many additional headers are returned on the request:

```Bash
curl -I http://localhost:3000
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Content-Type: text/html; charset=utf-8
Content-Length: 12
ETag: W/"c-Lve95gjOVATpfV8EL5X4nxwjKHE"
Date: Fri, 18 Apr 2025 16:10:33 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

## How it works:

The `helmet` module configures some of the HTTP headers on our requests based on its security
defaults. Here we applied the helmet middleware to our `Express.js` server.

The `helmet` module removes the `X-Powered-By: Express` header so that discovering the
server is Express-based becomes more difficult. The reason that we’ve obfuscated this is to protect
against attackers trying to exploit Express.js-oriented security vulnerabilities, slowing them down in
determining the type of server being used in the application.

At this point, `helmet` injects the following headers into our request, along with the appropriate defaults:

| Header                              | Description                                                                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`           | Helps mitigate against XSS attacks by allowing a policy to be defined that can control which resources the user agent is allowed to load |
| `Cross-Origin-Opener-Policy`        | Ensures that a top-level document can only interact with documents from the same origin                                                  |
| `Cross-Origin-Resource-Policy`      | Restricts resources so that they can only be accessed by same-origin documents                                                           |
| `Origin-Agent-Cluster`              | Ensures a document is isolated in a separate agent cluster to prevent data leaks between different origins                               |
| `Referrer-Policy`                   | Controls how much referrer information is included with requests sent from a site                                                        |
| `Strict-Transport-Security`         | Instructs browsers to only allow the website to be accessed using HTTPS                                                                  |
| `X-Content-Type-Options`            | Indicates that the MIME types configured in the `Content-Type` headers must be adhered to                                                |
| `X-DNS-Prefetch-Control`            | Controls DNS prefetching                                                                                                                 |
| `X-Download-Options`                | Disables the option to open a file on download                                                                                           |
| `X-Frame-Options`                   | Indicates whether a browser can render a page in a `<frame>`, `<iframe>`, `<embed>`, or `<object>` HTML element                          |
| `X-Permitted-Cross-Domain-Policies` | Instructs the browser on how to handle requests over a cross-domain                                                                      |
| `X-XSS-Protection`                  | Instructs the browser to stop page loading when a reflected XSS attack is detected                                                       |

The `helmet` module sets the injected HTTP headers to sensible secure defaults. However, they
can be customized. For example, you could manually set the value of `Referrer-Policy` to the
`no-referrer` header using the following code:

```JavaScript
app.use(
  helmet({
    referrerPolicy: { policy: 'no-referrer' },
  })
);
```

Additional HTTP headers can also be set using the helmet module. For more information, please
refer to the Helmet documentation (<https://helmetjs.github.io/>).

Some other popular web frameworks can also integrate the `helmet` middleware via the following modules:

- `Koa.js`: <https://www.npmjs.com/package/koa-helmet>

- `Fastify`: <https://www.npmjs.com/package/@fastify/helmet>

The `helmet` middleware simply modifies the response headers to appropriate defaults. To demonstrate
what helmet is doing under the covers, we can try injecting the same HTTP headers using the Node.
js core `http` module.

Start the `node-headers.js` server and rerun the `cURL` command and observe that the headers have been injected:

```Bash
curl -I http://localhost:3000
HTTP/1.1 200 OK
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Date: Fri, 18 Apr 2025 16:28:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```
