# Authentication with Fastify

Many web applications require a login system. Often, users of a website have different privileges, and
to determine which resources they can access, they must first be identified through authentication.

This is typically achieved by setting up a session, which is a temporary information exchange between
a user and a device. Sessions enable the server to store user-specific information, which can be used
to manage access and maintain the user’s state across multiple requests.

Here we built a login system using the `@fastify/cookie` and `@fastify/session` modules.

First, we imported and registered the `@fastify/session` plugin in the Fastify application (in
the `server.js` file). This plugin injects a session object into every request object. Before the user
is authenticated, the session value will be an empty object.

When registering the `@fastify/session` plugin, we provided the following configuration options:

- `Secret`: Used to sign the session ID cookie, ensuring its integrity and preventing tampering.
  It must be at least 32 characters long for security.

- `Cookie.httpOnly`: Configures the session cookie. Note that `httpOnly: true` makes
  the cookie inaccessible to client-side JavaScript, enhancing security.

- `SaveUninitialized`: Prevents saving unmodified sessions to the store, reducing storage
  usage and improving performance.

- `Resave`: Prevents resaving unchanged sessions, reducing unnecessary write operations to
  the session store.

The full list of configuration options is available in the `@fastify/session` API documentation
at <https://github.com/fastify/session?tab=readme-ov-file#api>.

In this recipe’s demo application, the login hyperlink on the web page redirects the user to the
`/auth/login` endpoint. The route handler for this endpoint was declared in a separate authentication router
(`routes/auth.js`). This route renders the `views/login.ejs` template, which contains the
HTML login form.

When the user enters their username and password in the form and clicks **Submit**, the browser
encodes the values and sets them as the request body. Our HTML form had its method set to HTTP
`POST` (`method="post"`), which instructs the browser to send an HTTP `POST` request when the
form is submitted. The action attribute in our HTML form was set to `login`, which instructs the
browser that the HTTP `POST` request should be sent to the `/auth/login` endpoint.

In `routes/auth.js`, we registered a handler for HTTP `POST` requests to the `/login` endpoint.
This handler extracts the username and password from the request body and checks whether they
match any user in our hardcoded array of users. If the credentials are valid, it saves the user information
in the session and renders the `index.ejs` template with the user data.

If the username and password don’t match, our HTTP `POST` `/auth/login` route handler renders
the `views/login.ejs` template with the `{ isAuth : false }` value. This instructs the
`views/login.ejs` template to render the **Login Failed.** message.

**Important note:**
Don’t store passwords in plain text in production applications! You’d typically validate the
supplied username and password against credentials stored in a secure database, with the
password being stored in a hashed form.

When the authentication process is successful, we set the `req.session.user` value to the supplied
username and redirect the authenticated user back to the `/` endpoint. At this point, the
`@fastify/session` middleware creates a session identifier and sets the `Set-Cookie` HTTP header on the
request. The `Set-Cookie` header is set to the session key name and session identifier.

The `@fastify/session` plugin defaults to using an in-process storage mechanism to store the
session tokens. However, these tokens are not expired, which means our process will continue to be
populated with more and more tokens. This could eventually result in degraded performance or crash
our process. Again, in production, you’d typically use a session store. The `@fastify/session`
plugin is based on the `express-session` list of compatible session stores at
<https://github.com/expressjs/session#compatible-session-stores>.

When the request is redirected to `/`, it now has the `Set-Cookie` HTTP header set. The
`@fastify/session` middleware recognizes the session key name and extracts the session identifier. From this
identifier, `@fastify/session` can query session storage for any associated state. In this case, the
state is the user object that we assign to the `req.session` object in `auth.js`.

The `req.session.user` value is passed through to the updated `views/index.ejs` template.
This template contains logic such that when a `req.session.user` value is present, it will render
the 'Hello **user.username**!' string. The logic in the template also switches between showing the Login or
Logout link, depending on whether the user is authenticated.

Clicking Logout sends an HTTP `GET` request to the `/auth/logout` endpoint. This endpoint sets
`req.session` to null, which ends the session and removes session data from the session store. Our
browser may continue to store and send the invalid session cookie until it expires, but with no valid
match in the session store, the server will ignore the session and consider the user unauthenticated.
