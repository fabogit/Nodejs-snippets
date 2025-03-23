# Watching files

Node.js’s fs module provides functionality that enables you to watch files and track when files or
directories are created, updated, or deleted.

In this recipe, we’ll create a small program named watch.js that watches for changes in a file using
the `watchFile()` API and then prints a message when a change has occurred.

Run `node watch.js` then open `file.txt` and make some edits, saving between each one. You will notice
that each time you save, a log entry appears in the Terminal where you’re running `watch.js`

In the recipe, we used the `watchFile()` function to watch for changes on a given file. The function
accepts three arguments—a filename, an optional list of options, and a listener function. The options
object can include the following:

- `BigInt`: The `BigInt` object is a JavaScript object that allows you to represent larger numbers
  more reliably. This defaults to `false`; when set to `true`, the numeric values returned from
  the object of `Stats` would be specified as `BigInt`.

- 1: This value indicates whether the Node.js process should continue to run while
  files are still being watched. It defaults to `true`.

- `interval`: The `interval` value controls how often the file should be polled for changes,
  measured in milliseconds. The default value is 5,007 milliseconds when no interval is supplied.

The listener function supplied to the `watchFile()` function will execute every time a change is
detected. The listener function’s arguments, current and previous are both `Stats` objects, representing
the current and previous state of the file.

Our listener function passed to `watchFile()` is executed each time a change has been detected in the file
being watched. Every time our updated function returns `true`, it logs the updated message to `stdout`.

The Node.js `fs` module provides another function, `watch()`, which watches for changes in files but
can also watch for directories. This function differs from `watchFile()` as it utilizes the operating
system’s underlying file system notification implementation rather than polling for changes.

Although faster and more reliable than the `watchFile()` API, the Watch API is not consistent
across various platforms. This is because the Watch API is dependent on the underlying operating
system’s method of notifying file system changes. The Node.js API documentation goes into more
detail about the limitations of the Watch API across different platforms:
<https://nodejs.org/docs/latest/api/fs.html#fs_availability>.

The `watch()` function similarly accepts three parameters—the filename, an array of options, and a
listener function. The options that can be passed via the `options` parameter are as follows:

- `persistent`: The `persistent` option is a Boolean that indicates whether the Node.js
  process should continue to run while files are still being watched. By default, the `persistent`
  option is set to `true`.

- `recursive`: The `recursive` option is another Boolean that allows the user to specify
  whether changes in subdirectories should be watched – by default, this value is set to `false`.
  The recursive option is only supported on macOS and Windows operating systems.

- `encoding`: The `encoding` option is used to specify which character encoding should be
  used for the filename specified—the default is `utf8`.

- `Signal`: An `AbortSignal` object that can be used to cancel file watching.

The listener function that is passed to the `watch()` API is slightly different from the listener function
passed to the `watchFile()` API. The arguments to the listener function are `eventType` and
`trigger`, where `eventType` is either `change` or `rename` and `trigger` is the file that triggered
an event. The following code represents a similar task to what we implemented in our recipe but using
the Watch API:

```JavaScript
const fs = require('node:fs');
const file = './file.txt';

fs.watch(file, (eventType, filename) => {
    const formattedTime = new Intl.DateTimeFormat('en-GB',
        {
            dateStyle: 'full',
            timeStyle: 'long'
        }).format(new Date());
    return console.log(`${filename} updated ${formattedTime}`);
});
```

The final steps of the recipe cover usage of the comprehensive `Intl.DateTimeFormat` utility
for manipulating dates and times. Refer to MDN Web Docs for a list of available formats and APIs on
`Intl.DateTimeFormat`: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat>.

**Important note:**
The `moment.js` library was once a go-to library for date manipulation and ormatting in JavaScript. However, with the advancement of modern JavaScript, built-in functionalities such as `Intl.DateTimeFormat` offers similar capabilities natively. Additionally, `moment.js` has been put into maintenance mode by its maintainers, meaning no new features will be added. Coupled with concerns about its bundle size, many developers are finding `moment.js` no longer necessary for their projects and are instead using built-in functionalities or more modern alternative libraries.

More recent versions of Node.js (later than v18.11.0) have a built-in watch-mode capability. To enable
watch mode, you supply the `--watch` command-line process flag:

```bash
node --watch app.js
```

While in watch mode, modifications to the observed files trigger a Node.js process restart. By default,
the built-in watch mode will monitor the main entry file and any modules that are required or imported.

It is also possible to specify the exact files you wish to watch with the `--watch-path` command-
line process flag:

```bash
node --watch-path=./src --watch-path=./test app.js
```

More information can be found in the Node.js API documentation:
<https://nodejs.org/dist/latest-v22.x/docs/api/cli.html#--watch>.
