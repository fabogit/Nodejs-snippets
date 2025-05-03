# Diagnosing issues with Chrome DevTools

Node.js offers a powerful debugging utility through the `--inspect` process flag, enabling us to
debug and profile our Node.js processes using the Chrome DevTools interface. This integration is made
possible by the Chrome DevTools Protocol, which facilitates communication between Node.js and
Chrome DevTools. The existence of this protocol allows for the creation of tools that seamlessly integrate
with Chrome DevTools, providing a unified debugging experience across different environments.

Here we will learn how to utilize Chrome DevTools to diagnose and resolve issues within a
web application. We’ll cover how to set up the debugging environment, connect to a Node.js process,
and navigate the various features of Chrome DevTools. This includes inspecting variables, setting
breakpoints, and stepping through our code.

**Important note:**
`node --debug` and `node --debug-brk` are legacy Node.js flags that have been deprecated
since Node.js v6.3.0. `node --inspect` and `node --inspect-brk are the modern
equivalents that should be used in place of these legacy flags.

We’re going to use Chrome DevTools (<https://developer.chrome.com/docs/devtools>)
to debug a route in our application. We expect the application to respond with
a random number between `0` and the number we specify in the route. For example,
<http://localhost:3000/10> should return a random number between `1` and `10`.

Start the program with `$ node server.js` and navigate to <http://localhost:3000/10>.
Refresh the endpoint a few times and you should notice that the program will often respond with a
number greater than `10`. This indicates that we have a bug in our program; so, let’s debug to try and
understand why this error is occurring.

First, we need to start our program with the debugger enabled. To do this, we need to pass the
`--inspect` argument to our Node.js process:

```Bash
node --inspect server.js
Debugger listening on ws://127.0.0.1:9229/4f8d3fd0-bf05-4bcb-a3a7-d16c033c3fb3
For help, see: https://nodejs.org/en/docs/inspector
Server listening on port 3000
Debugger attached.
```

Instead of going directly to the link specified in the output, navigate to <chrome://inspect/#devices> in Google Chrome.
Observe that `server.js` is showing up as **Remote Target**. Click the **inspect** link and the
Chrome DevTools window should open, click on `server.js` in the bottom-right corner in the console window. This should ensure our
`server.js` file is open.

Now, we can add a breakpoint. Click the number `8` in the line-of-code column to the left of our
code. A small red circle should appear next to the number. If you click **Show Debugger** in the
top-right corner, you should see the breakpoint listed in the **Breakpoints** panel.

Now, let’s open a new regular browser window and navigate to <http://localhost:3000/10>.
The request will hang because it has hit the breakpoint we registered on _line 8_.

Go back to Chrome DevTools. You should notice that there is a tooltip stating
**Paused on breakpoint** in the top-right corner of the interface. Also, to the right of the interface, you
should see a **Call Stack** panel, which details the call frames.

The debugger is waiting for us to act. We can choose to step in or out of the next instruction.
Let’s step into the function. To do this, click the icon of an arrow pointing down to a circle
(these icons are right above the **Paused on breakpoint** message). When you hover over each
icon, a tooltip will appear describing the icon’s behavior. Once you have stepped in, you will
see that we have moved into our `random.js` file.

While we’re in `random.js`, we can hover over the values to check whether they are what we
expect them to be. We can see that `n = 10`, as expected.

Step over the function (by clicking the semi-circular arrow with a dot underneath) and then
inspect the value of `randomNumber`. The random number generated might be greater than `10`.
This helps us determine that the error is in our `randomNumber`
logic of the previous line. Now that we have identified the line the error is on, it is easier to
locate the error. Observe that we are adding the string `'1'` rather than the number `1`.

We have learned how to pause and step through code using Chrome DevTools. We have also learned
that we can inspect variable values.

## How it works…

The ability to debug Node.js applications is provided by the V8 JavaScript engine. When we pass the
node process the `--inspect` argument, the Node.js process starts to listen for a debugging client.
Specifically, it is the V8 inspector that opens a port that accepts WebSocket connections. The WebSocket
connection allows the client and the V8 inspector to interact.

At the top of the Chrome DevTools window, you will see a URI that starts with `devtools://`. This
is a protocol that is recognized by the Google Chrome browser and instructs Google Chrome to open
the Chrome DevTools user interface.

Here we set a breakpoint in the Chrome DevTools window. When the line of code the
breakpoint is registered on is encountered, the event loop (JavaScript thread) will be paused. The V8
inspector will then send a message to the client over the WebSocket connection. The message from
the V8 inspector details the position and state of the program. The client can update its state based
on the information it receives.

Similarly, if the user chooses to step into a function, a command is sent to the V8 inspector to instruct
it to temporarily resume the execution of the script, pausing it again afterward. As before, the V8
inspector sends a message back to the client detailing the new position and state.

**Note:**
Node.js also provides a flag that we can use to pause an application on start. This feature enables
us to set up breakpoints before anything executes. It can also help when debugging an error
that occurs during the setup phase of your application. This feature can be enabled with the
`--inspect-brk` flag. The following is how we’d start `server.js` using the `--inspect-brk` flag:
`$ node --inspect-brk server.js`.

## There’s more…

Node.js provides a command-line inspector, which can be valuable when we do not have access to a
graphical user interface.

### Debugging with the command-line inspector

We can run the application using the command-line-based debugger with the
following command:
`$ node inspect server.js`

This command will enter us into debug mode and output the first three lines of `server.js`.

When using `node inspect`, the program pauses at the first line to allow you to set breakpoints
and configure the debugger before any code executes.

Debug mode provides a series of commands and functions that we can use to step through and debug
our program. You can output the complete list of these commands by typing `help` and hitting _Enter_.

One of the functions is the `list()` function, which will list a specified number of the following lines.
For example, we can type `list(11)` to output all twelve lines of our program:

```Bash
debug> list(11)
> 1 const express = require('express');
  2 const app = express();
  3 const random = require('./random');
  4
  5 app.get('/:number', (req, res) => {
  6   const number = req.params.number;
  7   res.send(random(number).toString());
  8 });
  9
10 app.listen(3000, () => {
11   console.log('Server listening on port 3000');
12 });
```

We can use the `setBreakpoint()` function to set a breakpoint. We must supply this function with
the line number on which we wish to set the breakpoint. There’s also a shorthand for this function: `sb()`.

Let’s set a breakpoint on _line 7_ by typing `setBreakpoint(7)` or `sb(7)`:

```Bash
debug> setBreakpoint(7)
  2 const app = express();
  3 const random = require('./random');
  4
  5 app.get('/:number', (req, res) => {
  6   const number = req.params.number;
> 7   res.send(random(number).toString());
  8 });
  9
10 app.listen(3000, () => {
11   console.log('Server listening on port 3000');
12 });
```

I
The caret `(>)` indicates that a breakpoint has been set on _line 7_.

The program is still paused. We can instruct the process to begin running by typing the continue
command, `cont`. This also has a shorthand command, `c`:

```Bash
debug> cont
< Server listening on port 3000
<
```

After entering the `cont` command, our program will start to run. Our breakpoint is within our request
handler function. Let’s send a request using `cURL` in a new terminal window:
`$ curl http://localhost:3000/10`

The command will hang, as it has hit our breakpoint on _line 7_ of `server.js`. If we go back to the
debug session, we will see the debugger has detected that a breakpoint has been reached:

```Bash
break in server.js:7
  5 app.get('/:number', (req, res) => {
  6   const number = req.params.number;
> 7   res.send(random(number).toString());
  8 });
  9
```

Now, to step into the function, we type the `step` command:

```Bash
debug> step
break in random.js:2
  1 module.exports = (n) => {
> 2   const randomNumber = Math.floor(Math.random() * n) + '1';
  3   return randomNumber;
  4 };
```

This goes into the `random.js` file. Note that the command-line debug utility provides an interface
similar to Chrome DevTools, just without a graphical user interface.

We can print out references in the current scope using the `exec` command. Type `exec n` to output
the value of `n`:

```Bash
debug> exec n
'10'
```

Now, we can progress to the next line using the `next` command:

```Bash
debug> next
break in random.js:3
  1 module.exports = (n) => {
  2   const randomNumber = Math.floor(Math.random() * n) + '1';
> 3   return randomNumber;
  4 };
  5
```

We can output the value of randomNumber`, which will help us identify where the faulty logic is:

```Bash
debug> exec randomNumber
'71'
```

Now, step out using the `out` command. This will take us back to our `server.js` file, but now
paused on the `toString()` method:

```Bash
debug> out
break in server.js:7
  5 app.get('/:number', (req, res) => {
  6   const number = req.params.number;
> 7   res.send(random(number).toString());
  8 });
  9
```

When you reach a breakpoint or pause execution in a function and wish to skip the remainder of the
function’s execution to return to the caller, you can use the `out` command. To exit the debugger, you
can type `.exit` or enter _Ctrl + C_ twice.

We’ve now learned how to step through our code and output reference values using the
command-line debugger.

### Debugging TypeScript

With TypeScript, the code that runs in the browser is compiled JavaScript, which can make debugging
difficult. Source maps solve this problem by mapping the compiled code back to your original TypeScript
code, allowing you to debug more effectively with Chrome DevTools.

Source maps are files that map your compiled JavaScript code back to the original TypeScript code.
This allows you to debug the original TypeScript code directly in Chrome DevTools, making it easier
to set breakpoints and understand errors. To enable source maps in TypeScript, you need to enable
them in the `tsconfig.json` file:

```Json
  "compilerOptions": {
    "sourceMap": true,
    ...
  }
```

Setting `sourceMap` to `true` instructs the TypeScript compiler to generate source maps for your
compiled JavaScript files.

Once you have enabled source maps and compiled your TypeScript code, you can use Chrome DevTools
to take advantage of them. With source maps enabled, your original TypeScript files will be listed, and you
can open these files and set breakpoints directly in the TypeScript code. When you hit a breakpoint or
encounter an error, Chrome DevTools will show the corresponding line in your original TypeScript code.
