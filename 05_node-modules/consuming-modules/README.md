# Node.js Modules

One of the main attractions of Node.js is the massive ecosystem of external third-party libraries. Node.
js modules are libraries or a set of functions you want to include in your application. Most modules
will provide an API to expose functionality. The `npm` registry is where most Node.js modules are
stored, where there are over a million Node.js modules available.

## Consuming Node.js modules

The recipe made use of both `npm`, the CLI bundled with Node.js, and the `npm` public registry to
download the `express` third-party module.

The first command of the recipe was `npm init`. This command initializes a new project in the
current working directory. By default, running this command will open a CLI utility that will ask for
some properties about your project. The following table defines the requested properties:

| Property            | Definition                                                                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OperatingSystem:    | Specifies the name of the project. It must be unique when publishing to the npm registry. A name can be prefixed by a scope; for example, @organization/package.                                     |
| Package nameVersion | The initial version of the project. It is typical of Node.js modules to follow the Semantic Versioning standard. The default value is 1.0.0.                                                         |
| Description         | A brief description of your project to help users understand what your project does and its purpose.                                                                                                 |
| Entry point         | The entry point file of your Node.js application or module. It’s the path to the main file that will be executed when your module is required by another application. The default value is index.js. |
| Test command        | Used to define the command to be run when executing npm test or npm run test. Typically, this will be the command that executes your test suite.                                                     |
| Git repository      | Specifies the location of your project’s source code repository. This is helpful for contributors and users who want to access the code, report issues, or contribute.                               |
| Keywords            | Keywords relating to your project.                                                                                                                                                                   |
| Author              | A list of the author(s) of the project.                                                                                                                                                              |
| License             | Indicates the license type under which the project is distributed. This is important for users to understand how they are permitted to use and share your project.                                   |

The only properties that are mandatory are the package name and version. It is also possible to skip
the CLI utility and accept all defaults by typing the following:

```Bash
$ npm init --yes
```

It is possible to configure default answers using the npm config command. This can be achieved
with the following command:

```Bash
$ npm config set init.author.name "Your Name"
```

Once the `npm init` command completes, it will generate a `package.json` file in your current
working directory. The `package.json` file does the following:

- It lists the packages that your project depends on, acting as a _blueprint_ or set of instructions as
  to which dependencies need to be installed

- Provides a mechanism for you to specify the versions of a package that your project can use –
  based on the Semantic Versioning specification (<https://semver.org/>)

In the next step of the recipe, we used the `npm install express` command to install the
`express` module. The command reaches out to the `npm` registry to download the latest version of
the module with the `express` name identifier.

**Important note:**
By default, when supplying a module name, the `npm install` command will look for a
module with that name and download it from the public `npm` registry. But it is also possible to
pass the `npm install` command other parameters, such as a GitHub URL, and the command
will install the content available at the URL. For more information, refer to the npm CLI
documentation: <https://docs.npmjs.com/cli/v10/commands/npm-install>.

When the `install` command completes, it will put the module contents into a `node_modules`
directory. If there isn’t one in the current project, but there is `package.json`, the command will
also create a `node_modules` directory.

If you look at the contents of the `node_modules` directory, you will notice that more than just the
`express` module is present. This is because `express` has dependencies, and their dependencies
may also have dependencies.

When installing a module, you’re potentially, and often, installing a whole tree of modules. The
following output shows a snippet of the structure of a `node_modules` directory from the recipe:

```Bash
$ ls node_modules
     |-- accepts
     |-- escape-html
     |-- ipaddr.js
     |-- raw-body
     |-- array-flatten
     |-- etag
     |-- media-typer
     |-- safe-buffer
     |-- ...
```

You can also use the `npm list` command to list the contents of your `node_modules` directory.

You may also notice that a `package-lock.json` file has been created. Files of the `package-lock.json`
type were introduced in `npm` version 5. The difference between `package-lock.json` and `package.json`
is that a `package-lock.json` file defines specific versions of all modules in the `node_modules` tree.

Due to the way dependencies are installed, two developers with the same `package.json` file may
experience different results when running `npm install`. This is mainly because a `package.json`
file can specify acceptable module ranges.

For example, in our recipe, we installed the latest version of `express`, and this resulted in the
following range:

```Json
"express": "^4.18.2"
```

The `^` character indicates that it will allow all versions above `v4.18.2` to be installed, but not `v5.x.x`.
If `v4.18.3` were to be released in the time between when developer A and developer B run the `npm install`
command, then it is likely that developer A will get `v4.18.2` and developer B will get `v4.18.3`.
If the `package-lock.json` file is shared between the developers, they will be guaranteed the
installation of the same version of `express` and the same versions of all the dependencies of `express`.

The npm CLI can also generate a `npm-shrinkwrap.json` file using the `npm shrinkwrap`
command. The `npm-shrinkwrap.json` file is identical in structure and serves a similar purpose
to the `package-lock.json` file. The `package-lock.json` file cannot be published to the
registry, whereas the `npm-shrinkwrap.json` can. Typically, when publishing an npm module,
you’ll want to not include the `npm-shrinkwrap.json` file as it would prevent the module from
receiving transitive dependency updates.
The presence of `npm-shrinkwrap.json` in a package means that all installs of that package will
generate the same dependencies. The `npm-shrinkwrap.json` file is useful for ensuring consistency
across installations in production environments.
In the final step of the recipe, we imported the `express` module to test whether it was installed
and accessible:

```JavaScript
const express = require('express');
```

Note that this is the same way in which you import Node.js core modules. The module-loading
algorithm will first check to see whether you’re requiring a core Node.js module; it will then look in
the `node_modules` folder to find the module with that name.
It is also possible to use `require()` to import files by passing a path, such as the following:

```JavaScript
const file = require('./file.js');
```

## Understanding development dependencies

In `package.json`, you can distinguish between development dependencies and regular dependencies.
Development dependencies are typically used for tooling that supports you in developing your application.

Development dependencies should not be required to run your application. Having a distinction between
dependencies that are required for your application to run and dependencies that are required to develop
your application is particularly useful when it comes to deploying your application. Your production
application deployment can omit development dependencies, which makes the resulting production
application smaller. A very common use of development dependencies is for linting and formatting.

To install a development dependency, you need to supply the `install` command with the `--save-dev`
parameter.For example, to install `semistandard`, we can use the following:

```Bash
$ npm install --save-dev --save-exact semistandard
```

The `--save-exact` parameter pins the exact version in your package.json file.

Observe that there is a separate section for development dependencies that have been created
in `package.json`:

```Json
{
  "name": "consuming-modules",
  "version": "1.0.0",
  "description": "",
  "main": "require-express.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "semistandard": "17.0.0"
  }
}
```

You can then execute the installed `semistandard` executable with the following command:

```Bash
$ ./node_modules/semistandard/bin/cmd.js
```

## Installing global modules

It is possible to globally install Node.js modules. Typically, the type of modules you’ll install globally
are binaries or a program that you want to be accessible in your terminal. To globally install a module,
you pass the `--global` command to the `install` command as follows:

```Bash
$ npm install --global lolcatjs
```

This will not install `lolcatjs` into your `node_modules` folder. Instead, it will be installed into
the `bin` directory of your Node.js installation. To see where it was installed, you can use the `which`
command (or where on Windows):

```Bash
$ which lolcatjs
/Users/bgriggs/.nvm/versions/node/v20.11.0/bin/lolcatjs
```

The `bin` directory is likely to already be in your path because that is where the `node` and `npm` binaries
are stored. Therefore, any executable program that is globally installed will also be made available in
your shell. Now, you should be able to call the `lolcatjs` module from your shell:

```Bash
$ lolcatjs --help
```

In `npm` v5.2, `npm` added the `npx` command to their CLI. This command allows you to execute a
global module without having it globally installed on your system. You could execute the `lolcatjs`
module without storing it with the following command:

```Bash
$ npx lolcatjs
```

In general, `npx` should be sufficient for most modules that you wish to execute. Using `npx` can be
preferable as it enables you to run packages without polluting your global namespace. It can also
help when you need to execute different versions of a package on a per-project basis as it avoids any
global version conflicts.

## Responsibly consuming modules

You’ll likely want to leverage the Node.js module ecosystem in your applications. Modules provide
solutions and implementations of common problems and tasks, so reusing existing code can save you
time when developing your applications.

As you saw in the recipe, simply pulling in the web framework, `express` pulled in over 80 other
modules. Pulling in this number of modules adds risk, especially if you’re using these modules for
production workloads.

There are many considerations you should make when choosing a Node.js module to include in your
application. The following three considerations should be made in particular:

- **Security:** Can you depend on the module to fix security vulnerabilities?

- **Licenses:** If you link with open source libraries and then distribute the software, your software
  needs to be compliant with the licenses of the linked libraries. Licenses can vary from restrictive/
  protective to permissive. In GitHub, you can navigate to the license file, and it will give you a
  basic overview of what the license permits.

- **Maintenance:** You’ll also need to consider how well maintained the module is. Many modules
  publish their source code to GitHub and have their bug reports viewable as GitHub issues.
  From viewing their issues and how/when the maintainers are responding to bug reports, you
  should be able to get some insight into how maintained the module is.
