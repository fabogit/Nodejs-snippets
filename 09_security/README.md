# Dealing with Security

So far we’ve learned how we can use Node.js to build applications. As with all software,
you must take certain precautions to ensure the application you’re building is secure.

First, you should ensure that you’ve adopted any Node.js releases that contain security fixes. For this
reason, where possible, you should aim to be on the latest release of a given Node.js release line.

Here we will cover some of the key aspects of Node.js web application security. The later recipes
demonstrate some of the common attacks on web applications, including **cross-site scripting (XSS)**
and **cross-site request forgery (CSRF)** attacks. They will showcase how to prevent and mitigate the
risk of some of these attacks.

Here we will cover the following recipes:

- Detecting dependency vulnerabilities

- Authentication with Fastify

- Hardening headers with Helmet

- Anticipating malicious input

- Preventing JSON pollution

- Guarding against XSS

- Preventing CSRF
