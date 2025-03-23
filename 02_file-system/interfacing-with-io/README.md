# I/O

**Standard in** (`stdin`) refers to an input stream that a program can use to read input from a command
shell or Terminal. Similarly, **standard out** (`stdout`) refers to the stream that is used to write the
output. **Standard error** (`stderr`) is a separate stream to `stdout` that is typically reserved for
outputting errors and diagnostic data.

The `process.stdin`, `process.stdout`, and `process.stderr` properties are all properties
on the `process` object. A global `process` object provides information and control of the Node.js process.
For each of the I/O channels (standard in, standard out, standard error), they emit data events for
every chunk of data received. In this recipe, we were running the program in interactive mode where
each data chunk was determined by the newline character when you hit Enter in your shell.

The `process.stdin.on('data', (data) => {...});` instance is what listens for these
data events. Each data event returns a `Buffer` object. The `Buffer` object (typically named `data`)
returns a binary representation of the input.

The `const name = data.toString()` instance is what turns the `Buffer` object into a
string. The `trim()` function removes all whitespace characters – including spaces, tabs, and newline
characters – from the beginning and end of a string. The whitespace characters include spaces, tabs,
and newline characters.

We write to `stdout` and `stderr` using the respective properties on the process object (`process.stdout.write`, `process.stderr.write`).

During the recipe, we also used Ctrl + C to exit the program in the shell. Ctrl + C sends `SIGINT`, or
signal interrupt, to the Node.js process. For more information about signal events, refer to the Node.
js Process API documentation: <https://nodejs.org/api/process.html#process_signal_events>.

## Important note

**Console APIs:** Under the hood, `console.log` and `console.err` are using `process.stdout` and `process.stderr`. Console methods are higher-level APIs and include automatic
formatting. It’s typical to use console methods for convenience and lower-level process methods
when you require more control over the stream.

## Promise

As of Node.js 17.0.0, Node.js provides an Experimental Readline Promises API, which is used for
reading a file line by line. The Promises API variant of this allows you to use `async`/`await` instead
of callbacks, providing a more modern and cleaner approach to handling asynchronous operations.

The `greetings-promise.js` script utilizes the `node:readline/promises` module, which provides the Promise
variant of the Readline API. It defines an asynchronous function, `greet()`, which prompts the user
for their name in the console and then greets them with a personalized message – similar to the main
recipe program. Using the Readline Promises API allows us to use the `async`/`await` syntax for
cleaner asynchronous code flow.
