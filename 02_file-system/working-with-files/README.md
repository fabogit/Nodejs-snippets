# Working with files

## Sync fs r/w: readWriteSync.js

The API documentation for the Node.js File System module is available at https://nodejs.org/api/fs.html.
The fs module provides APIs to interact with the file system using Node.js.
Similarly, the core path module provides APIs for working with file and directory paths.
The path module API documentation is available at https://nodejs.org/api/path.html.

We defined a variable to store the file path of `hello.txt` using the `path.join()` and `process.cwd()` functions. The `path.join()` function joins the path sections provided as parameters with
the separator for the specific platform (for example, / on Unix and \ on Windows environments).

The `process.cwd()` function is a function on the global process object that returns the current
directory of the Node.js process.
This program is expecting the `hello.txt` file to be in the same directory as the program.

We read the file using the `fs.readFileSync()` function. We pass this function the file
path to read and the encoding, UTF-8. The encoding parameter is optional—when the parameter is
omitted, the function will default to returning a Buffer object.

To perform manipulation of the file contents, we used the `toUpperCase()` function available on
string objects.

We updated the file using the `fs.writeFileSync()` function. We passed the
`fs.writeFileSync()` function two parameters. The first parameter was the path to the file we
wished to update, and the second parameter was the updated file contents.

Both the `readFileSync()` and `writeFileSync()` APIs are synchronous, which means
that they will block/delay concurrent operations until the file read or write is completed. To
avoid blocking, use the asynchronous versions of these functions.

## Async fs r/w

Throughout this recipe, we were operating on our files synchronously. However, Node.js was developed
with a focus on enabling the non-blocking I/O model; therefore, in many (if not most) cases, you’ll
want your operations to be asynchronous.

Today, there are three notable ways to handle asynchronous code in Node.js—callbacks, Promises, and
async/await syntax. The earliest versions of Node.js only supported the callback pattern. Promises
were added to the JavaScript specification with ECMAScript 2015, known as ES6, and subsequently,
support for Promises was added to Node.js. Following the addition of Promise support, `async`/
`await` syntax support was also added to Node.js.

All currently supported versions of Node.js now support callbacks, Promises, and `async`/`await`
syntax – you may find any of these used in modern Node.js development. Let’s explore how we can
work with files asynchronously using these techniques.

### Using Callback syntax: readFileAsync.js

The asynchronous version of `readFileSync()` is `readFile()`. The general convention is that
synchronous APIs will have the term “sync” appended to their name. The asynchronous function
requires a callback function to be passed to it. The callback function contains the code that we want
to be executed when the asynchronous task completes.

To demonstrate that this code is asynchronous, we can use the `setInterval()` function
to print a string to the screen while the program is running. The `setInterval()` function
enables you to schedule a function to happen after a specified delay in milliseconds. Add the
following line to the end of your program:

`setInterval(() => process.stdout.write('**** \n'), 1).unref();`

Observe that the string continues to be printed every millisecond, even in between when the file
is being read and rewritten. This shows that the file reading and writing have been implemented
in a non-blocking manner because operations are still completing while the file is being handled.

**Important note:**
Using `unref()` on `setInterval()` means this timer will not keep the Node.js event loop
active. This means that if it is the only active event in the event loop, Node.js may exit. This is
useful for timers for which you want to execute an action in the future but do not want to keep
the Node.js process running solely.

To demonstrate this further, you could add a delay between the reading and writing of the
file. To do this, wrap the `updateFile()` function in a `setTimeout()` function. The
`setTimeout()` function allows you to pass it a function and a delay in milliseconds:

`setTimeout(() => updateFile(filepath, upperContents), 10);`

### UsingPromises: readFilePromises.js

The `fs` Promises API was released in Node.js v10.0.0. The API provides File System functions that
return Promise objects rather than callbacks. Not all the original `fs` module APIs have equivalent
`Promise`-based APIs, as only a subset of the original APIs were converted to provide `Promise`
APIs.
Refer to the Node.js API documentation for a full list of `fs` functions provided via the `fs`
Promises API: <https://nodejs.org/docs/latest/api/fs.html#promises-api>.

A `Promise` is an object that is used to represent the completion of an asynchronous function. The
naming is based on the general definition of the term “promise”—an agreement to do something or
that something will happen. A `Promise` object is always in one of the three following states:

- Pending
- Fulfilled
- Rejected

A `Promise` will initially be in the pending state and will remain pending until it becomes either
fulfilled—when the task has completed successfully—or rejected—when the task has failed.

Two notable aspects of this implementation are the use of the following:

- `async function run() {...}`: Defines an asynchronous function named `run()`.
  Asynchronous functions enable the use of the `await` keyword for handling promises in a
  more synchronous-looking manner.

- `await fs.readFile(filepath, 'utf8')`: Uses the `await` keyword to asynchronously
  read the contents of the file specified.
