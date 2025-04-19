# Preventing JSON pollution

The JavaScript language allows all `Object` attributes to be altered. In a JSON pollution attack, an
attacker leverages this ability to override built-in attributes and functions with malicious code.

Applications that accept JSON as user input are the most susceptible to these attacks. In the most
severe cases, it’s possible to crash a server by just supplying additional values in JSON input. This can
make the server vulnerable to DoS attacks via JSON pollution.

The key to preventing JSON pollution attacks is to validate all JSON input. This can be done manually
or by defining a schema for your JSON to validate against.

Here we’re going to demonstrate a JSON pollution attack and learn how to protect against these
attacks by validating our JSON input. Specifically, we’ll be using **Another JSON Schema Validator**
(`Ajv`) to validate our JSON input.

We’re going to demonstrate a JSON pollution attack and learn how to use a JSON schema
to protect our applications from these attacks:

1. Start the server with the following command:

   ```Bash
   $ node server.js
   Server listening on port 3000
   ```

2. Next, we’ll send an HTTP `POST` request to <http://localhost:3000> using _cURL_. We’ll
   supply the `curl` command with the `-X` argument to specify the HTTP request method and the
   `-d` argument to supply the data. In a second terminal window, send the following `cURL` request:

   ```Bash
   $ curl -H "Content-Type: application/json" -X POST -d '{"msg": "Hello", "name": "User" }' http://localhost:3000/
   Hello User%
   ```

   As expected, the server responds with a greeting.

3. Now, let’s try altering the payload so that it sends an additional JSON property
   named `hasOwnProperty`:

   ```Bash
   $ curl -H "Content-Type: application/json" -X POST -d '{"msg": "Hello", "name": "User", "hasOwnProperty": 0 }' http://localhost:3000/
   curl: (52) Empty reply from server
   ```

   Note the empty reply from the server.

4. Check the terminal window where you’re running the server. You should see that it’s crashed
   with the following error:

   ```Bash
   Server listening on port 3000
   file:///Nodejs-snippets/09_security/json-pollution/server.js:15
   if (data.hasOwnProperty('name')) {
   ^
   TypeError: data.hasOwnProperty is not a function
   at IncomingMessage.<anonymous> (file:///Nodejs-snippets/09_security/json-pollution/server.js:15:12)
   at IncomingMessage.emit (node:events:518:28)
   at endReadableNT (node:internal/streams/readable:1698:12)
   at process.processTicksAndRejections (node:internal/process/task_queues:90:21)

   Node.js v22.14.0
   ```

   Our server has crashed because the `hasOwnProperty()` function has been overridden by
   the `hasOwnProperty` value in the JSON input. We can protect against this by validating
   our JSON input using the Ajv module.

   In `fixed-server.js` we’ve added a conditional statement that calls the `validate()` method within our
   `greeting()` function, which validates the schema.

5. Start the fixed server:
   ```Bash
   $ node fixed-server.js
   ```
6. Retry the same request in an attempt to override the `hasOwnProperty()` method. Observe
   that it receives no response and no longer crashes the server:

   ```Bash
    $ curl -H "Content-Type: application/json" -X POST -d '{"msg":"Hello", "name": "User", "hasOwnProperty": 0 }' http://localhost:3000/
   ```

With that, we’ve protected our server against a JSON pollution attack by validating the input against
a JSON schema.

## How it works…

Here we demonstrated a JSON pollution attack. To do this, we created a simple Express.js
server that had one route handler for HTTP `POST` requests at <http://localhost:3000>. For
each request, our `greeting()` function is called. The `greeting()` function parses the request
data as JSON and then aggregates the `msg` and `name` values that were supplied as request parameters.
The aggregated string is returned as the response to the request.

In our `server.js` file, we were using the `Object.prototype.hasOwnProperty()` method,
which is a built-in method available on all objects. However, it was possible to override the
`Object.prototype.hasOwnProperty()` method by passing a `hasOwnProperty` property in our JSON
input. Because we set the `hasOwnProperty` value to `0` in our JSON input, the server crashed when
our code attempted to call `data.hasOwnProperty()` – because that value had been overridden
to `0`, rather than a function.

When a public-facing application accepts JSON input, it’s necessary to take steps in the application
against JSON pollution attacks. One of the ways we covered for protecting applications from these
attacks is by using a JSON Schema validator. It validated that the properties and values of our JSON
input match those we expect. In this recipe, we used Ajv to define a schema to accomplish this. Ajv
uses the **JSON Schema** (<https://json-schema.org/>) format to define object schemas.

Our schema required the JSON input to have a `msg` property and allow an optional `name` property.
It also specified that both inputs must be of the string type. The `additionalProperties:false`
configuration disallowed additional properties, causing the validation to fail when we supplied
`hasOwnProperty` in the JSON input, making it impossible to override the `Object.prototype.hasOwnProperty` method.
