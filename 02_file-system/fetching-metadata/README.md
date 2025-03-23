# Fs metadata

Run using `node metadata.js ./file.txt` and `node metadata.js ./not-a-file.txt`

The `process.argv` property is a property on the global process object that returns an array containing
the arguments that were passed to the Node.js process. The first element of the `process.argv` array,
`process.argv[0]`, is the path of the node binary that is running. The second element is the path
of the file we’re executing – in this case, `metadata.js`. In the recipe, we passed the filename as the
third command-line argument and, therefore, referenced it with `process.argv[2]`.

Next, we created a `printMetadata()` function that called `statSync(file)`. The `statSync()`
function is a synchronous function that returns information about the file path that is passed to it.
The file path passed can be either a file or a directory. The information returned is in the form of a
`stats` object. The following table lists the information returned on the `stats` object:

| Attribute   | Description                           |
| ----------- | ------------------------------------- |
| dev         | Device identifier that holds the file |
| mode        | Access permissions                    |
| nlink       | Number of hard links                  |
| uid         | User identifier                       |
| gid         | Group identifier                      |
| rdev        | Device identifier of the device file  |
| blksize     | Fs block size                         |
| ino         | Inode number                          |
| size        | Total Bytes                           |
| blocks      | Number of 512-byte blocks allocated   |
| atimeMs     | Last access time in ms                |
| mtimeMs     | Last modification time in ms          |
| ctimeMs     | Last status change time in ms         |
| birthtimeMs | File creation time in ms              |

## Checking file access

It is recommended that if you’re attempting to read, write, or edit a file, you follow the approach of
handling the error if the file is not found.

However, if you simply wanted to check the existence of a file, you could use the `fs.access()` or
`fs.accessSync()` APIs. Specifically, the `fs.access()` function tests the user’s permissions
for accessing the file or directory passed to it. The function also allows an optional argument of mode
to be passed to it, where you can request the function to do a specific access check using Node.js file
access constants. A list of Node.js file access constants is available in the Node.js fs module API
documentation: <https://nodejs.org/api/fs.html#fs_file_access_constants>.
These enable you to check whether the Node.js process can read, write, or execute the file path provided.

**Important note:**
There is a legacy API that is now deprecated, called `fs.exists()`. It is not recommended you
use this function. The reason for deprecation was that the method’s interface was found to be
error-prone and could lead to accidental race conditions. The `fs.access()` or `fs.stat()`
APIs should be used instead.

### Modifying file permissions: permissions.js

The Node.js `fs` module provides APIs that can be used to alter the permissions on a given file. As with
many of the other `fs` functions, there is both an asynchronous API, `chmod()`, and an equivalent
synchronous API, `chmodSync()`. Both functions take a file path and mode as the first and second
arguments, respectively. The `chmod()` function accepts a third parameter, which is the callback
function to be executed upon completion.

**Important note:**
The `chmod` command is used to change access permissions of file system objects on Unix and
similar operating systems. If you’re unfamiliar with Unix file permissions, it is recommended
you refer to the Unix manual pages (<https://linux.die.net/man/1/chmod>).

The `mode` argument can be either in the form of a numeric bitmask using a series of constants provided
by the `fs` module or a sequence of three octal digits. The constants that can be used to create a bitmask
to define user permissions are defined in the Node.js API documentation: <https://nodejs.org/api/fshtml#fs_file_modes>.

Imagine that you have a file that currently has the following permissions:

- Owner readable and writeable

- Group readable

- Readable only by all other users (sometimes referred to as world readable)

If we wanted to additionally grant write access to those in the same group, we could use the following
Node.js code:

```JavaScript
const fs = require('node:fs');
const file = './file.txt';

fs.chmodSync(
    file,
    fs.constants.S_IRUSR |
    fs.constants.S_IWUSR |
    fs.constants.S_IRGRP |
    fs.constants.S_IWGRP |
    fs.constants.S_IROTH
);
```

This code is quite verbose. Adding a complex series or permissions would require
passing many constants to create a numeric bitmask. Alternatively, we can pass the `chmodSync()`
function an octal representation of file permissions, as is commonplace when using the Unix `chmod`
command on the command line.

The equivalent from the command line of `chmod 664`: `fs.chmodSync(file, 0o664);`

**Important note:**
Refer to <https://mason.gmu.edu/~montecin/UNIXpermiss.htm> for more detailed information on how Unix permissions work.

### Inspecting symbolic links

A symlink is a special file that stores a reference to another file or directory. When the `stat()` or
`statSync()` function from the Fetching metadata recipe is run on a symbolic link, the method will
return information about the file the symbolic link is referencing rather than the symbolic link itself.
The Node.js fs module does, however, provide methods named `lstat()` and `lstatSync()` that
inspect the symbolic link itself.

To create a symbolic link:

```bash
ln -s file.txt link-to-file
```

Now, you can use the Node.js Read-Eval-Print Loop (REPL) to test the `lstatSync()`
function. The Node.js REPL is an interactive shell we can pass statements to, and it will evaluate
them and return the result to the user.

```REPL
fs.lstatSync('link-to-file');
```
