# Creating an SMTP server

**SMTP** is a protocol for sending emails. In this recipe, we will be setting up an SMTP server using a
third-party npm module named `smtp-server`.

**Important note:**
Note that we could not name our directory for this recipe `smtp-server` as `npm` refuses to
allow you to install a module where the project name is the same as the module. If we had
named our directory `smtp-server`, our `package.json` name would have also been set
to `smtp-server`, and we would not be able to install the module with the same name.

Start your SMTP server:

```Bash
$ node server.js
[2025-04-01 17:13:08] INFO  SMTP Server listening on [::]:4321
```

You can test a connection to your server by using either the `nc` or `telnet` command-line
tools in a new terminal:

```Bash
$ telnet localhost 4321
$ nc -c localhost 4321
```

We’ve now confirmed that our SMTP server is available and listening on port `4321`.

## How it works…

We leveraged the `smtp-server` module. This module takes care of the implementation
of the SMTP protocol, meaning we can focus on the logic of our program rather than lower-level
implementation details.

The `smtp-server` module provides high-level APIs. In the recipe, we used the following to create
a new SMTP server object:

```JavaScript
const server = new SMTPServer({
  disabledCommands: ['STARTTLS', 'AUTH'],
  logger: true
});
```

The constructor of the `SMTPServer` object accepts many parameters. A full list of options that
can be passed to the `SMTPServer` constructor is available in the `nodemailer` documentation
at <https://nodemailer.com/extras/smtp-server/>.

In this recipe, we added the `disabledCommands: ['STARTTLS', 'AUTH']` option. This
option disabled **Transport Layer Security (TLS)** support and authentication for simplicity. However,
in production, it would not be recommended to disable TLS support and authentication. Instead,
it would be recommended to enforce TLS. You can do this with the `smtp-server` module by
specifying the `secure:true` option.

Should you wish to enforce TLS for the connection, you would also need to define a private key and a
certificate. If no certificate is provided, then the module will generate a self-signed certificate; however,
many clients reject these certificates.

The second option we specify on the `SMTPServer` constructor is the `logger:true` option, which
enables logging from our SMTP server.

To start our `SMTPServer` constructor, we call the `listen()` function on the `SMTPServer`
object. It is possible to pass the `listen()` function a port, a hostname, and a callback function. In
this case, we only provide the port; the hostname will default to `localhost`.

## Sending mail

Now that we’ve set up a simple SMTP server, we should try sending an email to it via Node.js.
To send an email with Node.js, we can use the `nodemailer` module from `npm`. This module is
provided by the same organization as the `smtp-server` module.

To test our `send-email.js` program, first start the SMTP server:

```Bash
$ node server.js
```

In a second terminal window, run your send-email.js program:

```Bash
$ node send-email.js
```

You should expect to see the following output from the server:

```Bash
[2025-04-01 17:22:25] INFO  SMTP Server listening on [::]:4321
[2025-04-01 17:22:47] INFO  [#mc2bdn7ochjjf6ip] Connection from ip6-localhost
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] S: 220 Garuda ESMTP
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] C: EHLO [127.0.0.1]
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] S: 250-Garuda Nice to meet you, ip6-localhost
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] 250-PIPELINING
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] 250-8BITMIME
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] 250 SMTPUTF8
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] C: MAIL FROM:<beth@example.com>
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] S: 250 Accepted
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] C: RCPT TO:<laddie@example.com>
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] S: 250 Accepted
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] C: DATA
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] S: 354 End data with <CR><LF>.<CR><LF>
[2025-04-01 17:22:47] INFO  <received 276 bytes>
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] C: <276 bytes of DATA>
[2025-04-01 17:22:47] DEBUG [#mc2bdn7ochjjf6ip] S: 250 OK: message queued
[2025-04-01 17:22:47] INFO  [#mc2bdn7ochjjf6ip] mc2bdn7ochjjf6ip received "close" event from ::1
[2025-04-01 17:22:47] INFO  [#mc2bdn7ochjjf6ip] Connection closed to ip6-localhost

```

You should see the output like the following from the `send-email.js` program:

```Bash
Message Sent: {
  accepted: [ 'laddie@example.com' ],
  rejected: [],
  ehlo: [ 'PIPELINING', '8BITMIME', 'SMTPUTF8' ],
  envelopeTime: 4,
  messageTime: 44,
  messageSize: 279,
  response: '250 OK: message queued',
  envelope: { from: 'beth@example.com', to: [ 'laddie@example.com' ] },
  messageId: '<00c21da3-1c77-8c1c-52ad-560b06dd548c@example.com>'
}
```

This shows that we have successfully created an SMTP server, and we’re able to send emails to the
SMTP server from another Node.js program.
