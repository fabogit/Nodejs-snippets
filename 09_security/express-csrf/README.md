# Preventing cross-site request forgery

CSRF is an attack where a malicious web application causes a user’s web browser to execute an action
on another trusted web application where the user is logged in.

Here we’re going to learn how to secure an Express.js server against CSRF attacks.

**Important note:**
Browser security has improved significantly in recent years. It’s very difficult to replicate a CSRF
attack on any modern browser. However, as there are still many users on older browsers, it’s
important to understand how these attacks work and how to protect against them. In this recipe,
we’ll replicate a CSRF attack on the same domain. Please refer to the
_Developers: Get Ready for New SameSite=None; Secure Cookie Settings_ (<https://blog.chromium.org/2019/10/developers-get-ready-for-new.html>)
Chromium blog, which covers some of the updates that have been made to Google Chrome to prevent CSRF attacks.

First, we’ll create a malicious web page that can replicate a CSRF attack. After that, we’ll learn how to
protect our Express.js server against these attacks.

- Start the server:

  ```Bash
  $ node server.js
  Server listening on port 3000
  ```

- Navigate to <http://localhost:3000> in your browser and expect to see the
  HTML login form. Enter `user` as the username and `badpassword` as the password. Then,
  click **Submit**.

- Once logged in, you should be taken to the **Settings** page of the demo social media profile.
  Notice that there’s a single field to update your email. Try updating the email to something else.
  You should see that the update is reflected after clicking **Update**.

Now, we’re going to create our malicious web page in `csrf-server.js`.

- In a second terminal window, start the `csrf-server.js` server:

  ```Bash
  $ node csrf-server.js
  Server listening on port 3001
  ```

**Important note:**
In a real CSRF attack, we’d expect the attack to come from a different domain to the vulnerable
server. However, due to advances in web browser security, many CSRF attacks are prevented
by the browser. For this recipe, we’ll demonstrate the attack on the same domain. Note that
CSRF attacks are still possible today, particularly as many users may be using older browsers
that don’t have the latest security features to protect against CSRF attacks.

- Navigate to <http://localhost:3001> in your browser. Expect to see a single button,
  click the **Click this to win!** button. By clicking the button, an HTTP `POST` request is sent to
  <http://localhost:3000/update>, with a body containing the `attacker@example.com` email.
  By clicking this button, the HTTP `POST` request has been sent to the real website’s
  server, leveraging the cookie stored in the browser.

- Go back to the social media profile page and refresh it. We’ll see that the attacker has managed
  to update the email address!

Now, let’s fix the server so that it isn’t susceptible to CSRF attacks!

Having stopped the original server, start `fixed-server.js`:

```Bash
$ node fixed-server.js
Server listening on port 3000
```

Return to <http://localhost:3000> and log in again with the same credentials as
before. Then, in a second browser tab, visit <http://127.0.0.1:3001> (`csrf-server.js`
should still be running) and click the button again. Note that you must navigate using
<http://127.0.0.1:3001> rather than <http://localhost:3001>; otherwise, the
request will be considered as coming from the same domain.

You’ll find that this time, clicking the button will not update the email on the
**Social Media Account - Settings** page. If we open
**Chrome DevTools | Console**, we’ll even see a **403 (Forbidden)** error,
confirming that our change has prevented the attack

We demonstrated a simple CSRF attack and the associated risks. We mitigated the
vulnerability by supplying additional configuration using the express-session middleware.

## How it works…

Here we demonstrated a simple CSRF attack. The attacker crafted a malicious site to leverage a
cookie from a social media website to update a user’s email to their own. This is a dangerous vulnerability
as once an attacker has updated the email to their own, they can end up with control over the account.

To mitigate this vulnerability, we passed the `express-session` middleware the
`{ cookie : { sameSite : true }}` configuration. The `SameSite` attribute of the cookie header can be
set to the following three values:

- `none`: The cookie can be shared and sent in all contexts, including cross-origin requests

- `lax`: This allows the cookie to be shared with HTTP `GET` requests initiated by third-party
  websites, but only when it results in top-level navigation

- `strict`: Cookies can only be sent through a request in a first-party context – if the cookie
  matches the current site URL

Setting the `{ sameSite : true }` configuration option in the `express-session` middleware
configuration equates to setting the Set-Cookie : SameSite attribute to strict mode.

Inspecting the header of the request in this recipe would show a `Set-Cookie` header similar to
the following:

```Bash
Set-Cookie:
SESSIONID=s%3AglL\_...gIvei%2BEs; Path=/; HttpOnly; SameSite=Strict
```

### There’s more…

Some older browsers don’t support the `Set-Cookie SameSite` header attribute. A strategy for
dealing with these cases is to generate an anti-CSRF token. These anti-CSRF tokens are stored in the
user session, which means the attacker would need access to the session itself to carry out the attack.

We can use a module named `csurf` to help implement anti-CSRF tokens.

Start the server:

```Bash
$ node csurf-server.js
Server listening on port 3000
```

Navigate to <http://localhost:3000> and log in with the same username and password
that we used before. Click on **View Page Source** on the **Social Media Account - Settings**
page. You should see the following HTML showing the hidden `_csrf` field:

```html
<input
  type="hidden"
  name="_csrf"
  value="r3AByUA1-csl3hIjrE3J4fB6nRoBT8GCr9YE"
/>
```

You should be able to update the email as before.

The `csurf` middleware helps mitigate the risk of CSRF attacks in older browsers that don’t support
the `Set-Cookie:SameSite` attribute. However, our servers could still be vulnerable to more
complex CSRF attacks, even when using the `csurf` middleware. The attacker could use XSS to obtain
the CSRF token, and then craft a CSRF attack using the `_csrf` token. However, this is best-effort
mitigation in the absence of support for the `Set-Cookie:SameSite` attribute.

Slowing an attacker down by making the attack they have to create more complex is an effective way
of reducing risk. Many attackers will try to exploit many websites at a time – if they experience a
website that takes significantly longer to exploit, in the interest of time, they will often just move on
to another website.
