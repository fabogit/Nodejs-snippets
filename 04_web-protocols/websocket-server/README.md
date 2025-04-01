# Creating a WebSocket server

The **WebSocket protocol** enables two-way communication between a browser and a server. `WebSockets`
are commonly leveraged for building real-time web applications, such as instant messaging clients.

Start your server in one terminal window and your client in a second terminal window:

```Bash
$ node server.js
$ node client.js
```

Access <http://localhost:8080> in your browser, and you should see a simple input
box with a **Submit** button. Type `Hello` into the input box and click **Submit**. The WebSocket
server should respond with `World!`.

If we look at the terminal window where we are running our server, we should see that the server
received the message: `Received: Hello`. This means that we have now got a client and server
communicating over WebSockets.

## How it works…

We used the `ws` module to define a WebSocket server:

```JavaScript
const WebSocketServer = new WebSocket.Server({
  port: 3000,
});
```

We then registered a listener for the connection event. The function passed to this is executed each
time there is a new connection to the WebSocket. Within the connection event callback function, we
have a socket instance in which we registered a listener for the message event, which gets executed
each time a message is received on that socket.

For our client, we defined a regular HTTP server to serve our `index.html` file. Our `index.html`
file contains JavaScript that is executed within the browser. Within this JavaScript, we created
a connection to our WebSocket server, providing the endpoint that the `ws` object is listening to:

```JavaScript
    const ws = new WebSocket('ws://localhost:3000');
```

To send a message to our WebSocket server, we just call send on the `ws` object with `ws.send(msg)`.

We wrapped the `ws.send(msg)` in an event listener. The event listener was listening for the “click”
event on the **Submit** button, meaning that we would send the message to the WebSocket when the
**Submit** button was clicked.

In our script in `index.html`, we registered event listener functions on our WebSocket, including
`onmessage`, `onclose`, and `onerror` event listeners:

```JavaScript
    ws.onmessage = function (e) {
        output.innerHTML += log('Received', e.data);
    };
    ws.onclose = function (e) {
        output.innerHTML += log('Disconnected', e.code);
    };
    ws.onerror = function (e) {
        output.innerHTML += log('Error', e.data);
    };
```

These functions execute on their respective events. For example, the `onmessage()` event listener
function would execute when our WebSocket receives a message. We use these event listeners to add
output to our web page according to the event.

## WebSocket communication between two Node.js programs

Now, we’ve learned how we can communicate between a browser and a server using WebSockets.
But it is also possible to create a WebSocket client in Node.js, enabling two Node.js programs to
communicate over WebSockets.

Start both the WebSocket server and your Node.js-based client in separate terminal windows:

```Bash
$ node server.js
$ node node-client.js
```

You should expect to see the server responding every 3 seconds to your `'Hello'` message
with the `World!` message:

```Bash
Connected
Received:Received:Received:World!
World!
World!
```
