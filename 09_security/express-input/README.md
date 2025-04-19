# Anticipating malicious input

One of the easiest groups of vulnerabilities that hackers exploit is injection attacks, with SQL injection
attacks being particularly common. SQL injection attacks are where an attacker injects malicious SQL
into an application to delete, distort, or expose data stored in the database.

If an application accepts input in any form, you need to take necessary precautions to ensure that
malicious inputs cannot exploit your application.

Parameter pollution is a type of injection attack where the HTTP parameters of a web application’s
HTTP endpoints are injected with specific malicious input. HTTP parameter pollution can be used
to expose internal data or even cause a **denial of service (DoS)** attack, where an attacker tries to
interrupt a resource and render it inaccessible to the resource’s intended users.

Parameter pollution attacks are where malicious input is injected into URL parameters.

In `server.js` we’ve created an Express.js server that responds to the `/` request and handles a single parameter,
`msg`. The Express.js server returns the `msg` value we pass it but in uppercase form:

1.  First, start the server:
    ```Bash
    $ node server.js
    Server listening on port 3000
    ```
2.  In a second terminal window, we should test that the server is working as expected by sending
    a request:
    ```Bash
    $ curl http://localhost:3000/\?msg\=hello
    HELLO%
    ```
3.  Let’s see what happens when we pass the msg parameter twice:
    ```Bash
    $ curl http://localhost:3000/\?msg\=hello\&msg\=world
    curl: (52) Empty reply from
    ```
4.  Now, if we go back to our first terminal window, we’ll see that the server has crashed with the
    following error:
    ```Bash
    Server listening on port 3000
    /Users/bgriggs/Node.js-Cookbook/Chapter09/express-input/server.
    js:6
        const upper = (req.query.msg || '').toUpperCase();
                                            ^
    TypeError: (req.query.msg || "").toUpperCase is not a function
        at Timeout._onTimeout (/Users/bgriggs/Node.js-Cookbook/
    Chapter09/express-input/server.js:6:41)
        at listOnTimeout (node:internal/timers:573:17)
        at process.processTimers (node:internal/timers:514:7)
    Node.js v22.12.0
    ```

So, it’s possible to cause the server to crash just by sending duplicate parameters. This makes
it fairly easy for a perpetrator to launch an effective DoS attack.

The error message states `.toUpperCase is not a function`. The `toUpperCase()`
function is available on `String.prototype`. This means that the value we call this function
on is not of the `String.prototype` type, resulting in `TypeError`. This happened because
the multiple `msg` values have been transformed into an array. To protect against this, we should
add some logic so that we always take the last value of `msg` when multiple values are specified.

5. Start the fixed server:
   ```Bash
   $ node fixed-server.js
   ```
6. Now, let’s retry our request, where we pass the `msg` parameter twice:

   ```Bash
    $ curl http://localhost:3000/\?msg\=hello\&msg\=world
    WORLD%
   ```

   Our logic to always set the `msg` variable to the last value is working. Observe that the server
   no longer crashes.

With that, we’ve learned how URL parameters can be exploited to cause DoS attacks and how we can
add logic to our code to guard against these attacks.

## How it works…

Injection attacks are made possible when inputs aren’t sanitized appropriately. Here we
wrongly assumed that the `msg` parameter would only ever be a string.

Many Node.js web frameworks support duplicate parameters in URLs, despite there being no
specification on how these should be handled.

Express.js depends on the `qs` module for URL parameter handling. The `qs` module’s approach to
handling multiple parameters of the same name is to convert the duplicate names into an array. As
demonstrated in this recipe, this conversion results in code breakages and unexpected behavior.

Here our server crashed because it was trying to call the `toUpperCase()` function on an
`Array` global object, which doesn’t exist on that type. This means that attackers have a very easily
exploitable method of disabling servers by supplying malformed/malicious input. Other than enabling
DoS-style attacks, not sanitizing and validating input parameters can lead to XSS attacks.

## There’s more…

Node.js `Buffer` objects can be exploited by attackers if used incorrectly in application code. `Buffer`
objects represent a fixed-length series of bytes and are a subclass of JavaScript’s `Uint8Array()`
class. In many cases, you’ll be interacting with `Buffer` objects via higher-level APIs, such as using
`fs.readFile()` to read files. However, in cases where you need to interact with binary data directly,
you may use `Buffer` objects since they provide low-level fine-grained APIs for data manipulation.

In past years, a lot of attention was brought to the unsafe uses of Node.js’s `Buffer` constructor.
Earlier concerns about using the `Buffer` constructor were regarding it not zero-filling new `Buffer`
instances, leading to the risk of sensitive data being exposed via memory.

**Important note:**
All of the following examples were created via the Node.js REPL. The Node.js REPL can be
started by entering `$ node` in your terminal window.

In Node.js 6, calling `new Buffer(int)` would create a new `Buffer` object but not override any
existing memory:

```Bash
> new Buffer(10)
> <Buffer b7 20 00 00 00 00 00 00 00 2c>
```

The security implications of this were recognized. By not overwriting the data when we initialize a
new `Buffer` object, we could accidentally expose some of the previous memory. In the worst cases,
this could expose sensitive data.

However, in versions of Node.js later than version 8, calling `Buffer(int)` will result in a zero-filled
`Buffer` object of `int` size:

```Bash
> $ node
> new Buffer(10)
> <Buffer 00 00 00 00 00 00 00 00 00 00>
```

Calling `new Buffer(int)` is still deprecated and as of Node.js 22, using this constructor will emit
a deprecation warning:

```Bash
> new Buffer(10)
> <Buffer 00 00 00 00 00 00 00 00 00 00>
> (node:46906) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues.
> Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.
> (Use `node --trace-deprecation ...` to show where the warning was created)
```

This is because there are still security risks associated with using the `new Buffer(int)` constructor.
Let’s demonstrate that risk now.

Imagine that our application accepted some user input in JSON form and we created a `new Buffer()`
object from one of the values:

```Bash
> let greeting = { "msg" : "hello" }
> undefined
> new Buffer(greeting.msg)
> <Buffer 68 65 6c 6c 6f>
> (node:47025) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues.
> Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.
> (Use `node --trace-deprecation ...` to show where the warning was created)
```

We can see that this works as expected (ignoring the deprecation warning). Calling `Buffer(string)`
creates a new `Buffer` object containing the string value. Now, let’s see what happens if we set `msg`
to a number rather than a string:

```Bash
> greeting = { "msg" : 10 }
> { msg: 10 }
> new Buffer(greeting.msg)
> <Buffer 00 00 00 00 00 00 00 00 00 00>
> (node:47073) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues.
> Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.
> (Use `node --trace-deprecation ...` to show where the warning was created)
```

This has created a `Buffer` object of size `10`. So, an attacker could pass any value via the `msg` property,
and a `Buffer` object of that size would be created. A simple DoS attack could be launched by the
attacker by supplying large integer values on each request.

The deprecation warning recommends using `Buffer.from(req.body.string)` instead. Upon
passing the `Buffer.from()` method, a number will throw an exception:

```Bash
> new Buffer.from(greeting.msg)
> Uncaught:
> TypeError [ERR_INVALID_ARG_TYPE]: The first argument must be of type
> string or an instance of Buffer, ArrayBuffer, or Array or an Array-
> like Object. Received type number (10)
```

This helps protect our code from unexpected input. To create a new `Buffer` object of a given size,
you should use the `Buffer.alloc(int)` method:

```Bash
> new Buffer.alloc(10)
> <Buffer 00 00 00 00 00 00 00 00 00 00>
```

There is also a `Buffer.allocUnsafe()` constructor. The `Buffer.allocUnsafe()` constructor
provides similar behavior to that seen in Node.js versions before Node.js 7, where the memory wasn’t
entirely zero-filled on initialization:

```Bash
> $ new Buffer.allocUnsafe(10)
> <Buffer 00 00 00 00 00 00 00 00 ff ff>
```

For the reasons mentioned earlier, use the `Buffer.allocUnsafe()` constructor with caution.
