# Scaffolding a module

In this recipe, we’ll be scaffolding our first module; that is, we will set up a typical file and directory
structure for our module and learn how to initialize our project with the npm CLI. We’ll also create a
GitHub repository to store our module code. GitHub is a hosting provider that allows users to store
their **Git**-based repositories, where Git is a **version control system (VCS)**.
The module we’re going to make will expose an API that converts the temperature in Fahrenheit to
Celsius and vice versa.

**Important note:**
A `.gitignore` file informs Git which files to omit, or ignore, in a project. GitHub provides
a default `.gitignore` file per language or runtime. GitHub’s default `.gitignore` file for
Node.js is visible at <https://github.com/github/gitignore/blob/master/Node.gitignore>.
Note that `node_modules` is automatically added to `.gitignore`.
The `package.json` file instructs which modules need to be installed for a project, and it
is typically expected that each developer would run the `npm install` command on their
development environment rather than have the `node_modules` directory committed to
source control.

**Important note:**
It’s preferred to use Secure Shell (SSH) to clone the repository. If you have not set up your SSH
keys for GitHub, then you should follow the steps at <https://docs.github.com/en/authentication/connecting-to-github-with-ssh>.

## How it works…

To kick off our project, we begin by setting up a GitHub repository, which serves as a central hub
for storing and managing our code base. This involves creating a new repository on GitHub, where
we’ll store our module code under a specified name – in this case, `temperature-converter`.
Additionally, we take the opportunity to include a `.gitignore` file, which informs Git of files to
exclude from version control and add a license file, defining how others can use our code.

Once our repository is established, we clone it locally using the Git CLI. Cloning creates a copy of the
repository on our local machine, allowing us to work on the code base offline and push changes back
to the remote repository when ready. We navigate into the cloned directory to inspect its contents and
review the repository’s status and history using `git status` and `git log`.

With our local setup ready, we initialize our module using npm. The `npm init` command guides us
through creating a `package.json` file, which contains essential metadata about our project, such
as its name, version, and dependencies. This file serves as a blueprint for our module and ensures
consistency across different environments.

To finalize our initial setup, we commit our changes to the repository. This involves staging the
`package.json` and `README.md` files, committing them with a descriptive message, and pushing
the changes to the remote repository on GitHub. This step ensures that our project’s history is well
documented and that our latest changes are published.

**Important note:**
Git is a powerful tool that is commonly used for source control of software. If you’re unfamiliar
with Git, GitHub provides an interactive guide for you to learn at <https://guides.github.com/introduction/flow/>.

We specified the module version as v0.1.0 to adhere to Semantic Versioning. Let’s look
at this in more detail.

**Semantic Versioning**, often abbreviated to **SemVer**, is a well-known standard for versioning. Node.
js itself tries to adhere to Semantic Versioning as much as possible.

Semantic version numbers are in the form of `X.Y.Z`, where the following applies:

- X represents the major version

- Y represents the minor version

- Z represents the patch version

Briefly, Semantic Versioning states that you increment the major version, the first value, when you
make breaking API changes. The second number, the minor version, is incremented when new features
have been added in a backward-compatible (or non-breaking) manner. The patch version, or the third
number, is for bug fixes and non-breaking and non-additive updates.

The major version `0` is reserved for initial development, and it is acceptable to make breaking changes
up until v1 is released. It is often disputed what the initial version should be. In the recipe, we started
with version `v0.1.0` to allow us the freedom to make breaking changes in early development without
having to increment the major version number.

Following Semantic Versioning is commonplace in the Node.js module ecosystem. The `npm` CLI
takes this into account by allowing semver ranges in `package.json` visit <https://docs.npmjs.com/files/package.son#dependencies>
for more information on `npm` version ranges.

The `npm` CLI provides an API to support Semantic Versioning. The `npm version` command can
be supplied with major, minor, or patch to increment the appropriate version numbers in your
`package.json` file. There are further arguments that can be passed to the `npm version` command,
including support for pre-versions – refer to <https://docs.npmjs.com/cli/version> for
more information.

## Writing module code

We’re going to start writing our module code. The module we will write will expose
two APIs that will be used to convert the supplied temperature from Fahrenheit to Celsius and vice
versa. We’ll also install a popular code formatter to keep our module code consistent and add some
simple test cases.

We can test if our small program works from the command line with the following commands:

```Bash
$ node --print "require('./').fahrenheitToCelsius(100)"
37.77777777777778
$ node --print "require('./').celsiusToFahrenheit(37)"
98.6
```

To ensure consistency and readability in our module’s code base, we begin by incorporating a popular
code formatter, `semistandard`, as part of our development workflow. This ensures that our code
follows a standardized style, making it easier for other developers to understand and collaborate on
our project.

With `semistandard` installed as a development dependency, we proceed to implement the core
functionality of our module. We define two conversion functions, `fahrenheitToCelsius()`
and `celsiusToFahrenheit()`, leveraging well-known mathematical formulas for temperature
conversion. These functions are encapsulated within our `index.js` file, making them accessible
for use within our module.

To expose these conversion functions externally, we add an `export` statement at the bottom of our
file, allowing other modules to import and utilize them as needed. This establishes a clear interface
for interacting with our module’s functionality.

To validate the correctness of our implementation, we create a simple test file, `test.js`, using Node.
js’s built-in `assert` module. This file contains test cases for each conversion function, ensuring that
they produce the expected results under various input conditions.

Upon running the test file, we confirm that all tests pass, indicating that our module’s functionality
behaves as intended. We then enhance our development workflow by defining `npm` scripts for linting
and testing, streamlining the process of code formatting and validation.

Running `npm run lint` checks our code base for adherence to coding standards, while `npm test` executes
our test suite to verify the correctness of our implementation. Any deviations from
the coding standards or failing tests are highlighted for resolution. It is possible to create as many
custom scripts as is suitable for your project.

**Important note:**
The `npm` CLI supports many shortcuts. For example, `npm install` can be shortened to `npm i`.
The `npm test` command can be shortened to `npm t`. The `npm run-script` command
can be shortened to `npm run`. For more details, refer to the npm CLI documentation:
<https://docs.npmjs.com/cli-documentation/cli>.

Finally, with our code base implemented, validated, and organized, we commit our changes using Git
and push them to our GitHub repository. This ensures that our project’s history is well documented
and that our latest updates are available to collaborators.

## Publishing a module

Publishing your module to the `npm` registry will make it available for other developers to find and
include in their applications. This is how the `npm` ecosystem operates: developers will author and
publish modules to `npm` for other developers to consume and reuse in their Node.js application.

We will be publishing the `temperature-converter` module to the `npm` registry.
Specifically, we’ll be publishing our module to a scoped namespace, so you can expect your module
to be available at `@npmusername/temperature-converter` (we will need to have an npm account. Go to
<https://www.npmjs.com/signup> to sign up for an account. Keep note of your npm username.).

Once you have signed up for an npm account, you can authorize your npm client with the
following command:

```Bash
$ npm login
npm notice Log in on https://registry.npmjs.org/
Login at:
https://www.npmjs.com/login?next=/login/cli/{UUID}
Press ENTER to open in the browser...
Logged in on https://registry.npmjs.org/.
```

It is ideal to keep your public GitHub repository up to date. Typically, module authors will
create a tag on GitHub that matches the version that is pushed to `npm`. This can act as an audit
trail for users wishing to see the source code of the module at a particular version, without
having to download it via `npm`. However, please note that nothing is enforcing that the code
you publish to `npm` must match the code you publish to GitHub:

```Bash
$ git add .
$ git commit --message "v1.0.0"
$ git push origin main
$ git tag v1.0.0
$ git push origin v1.0.0
```

Now, we’re ready to publish our module to the `npm` registry using the following command:

```Bash
$ npm publish --access=public
```

You can check that your publish was successful by navigating to https://www.npmjs.
com/package/@npmusername/temperature-converter. Expect to see the following
information about your module:

### How it works

We first authenticated our local npm client using the `npm login` command. The npm client provides
the ability to set up access controls so that certain users can publish to specific modules or scopes.

The `npm login` command identifies who you are and where you’re entitled to publish. It is also
possible to log out using `npm logout`.

The command that did the actual publishing to the registry was the following:

```Bash
$ npm publish --access=public
```

The `npm publish` command attempts to publish the package at the location identified by the name
field in the `package.json` file. In the recipe, we published it to a scoped package – specifically,
we used our own username’s scope. Scoped packages help to avoid naming conflicts. It is possible to
publish your package to the global scope by not passing it a named scope – but you’re likely to run
into name conflicts if your package has a common name.

We also passed the `--access=public` flag. When publishing to a scoped package, we explicitly
need to indicate that we want the module to be public. The `npm` CLI allows you to publish your
modules as either public or private for scoped packages. To publish a module privately, you need to
have a paid npm account. Note that the `--access=public` flag is not required when publishing
to the global scope because all modules in the global namespace are public.

The `npm publish` command packaged up our module code and uploaded it to the npm registry.
Because the `package.json` file generated from the `npm init` command is generated with
consistent properties, npm can extract and render that information on the module’s page. As shown
in the recipe, npm automatically populated the README file, version, and GitHub links in the UI
based on the information in our `package.json` file.

Next, we’ll consider prepublish scripts and the `.npmignore` file and look at how to publish to
private registries.

### Using prepublish scripts

The npm CLI supports a `prepublishOnly` script. This script will only run before the module is
packaged and published. This is useful for catching mistakes before publishing. Should a mistake be
made, it may be necessary to publish a second version to correct this mistake, causing potentially
avoidable inconvenience to your module consumers.

Let’s add a `prepublishOnly` script to our module. Our `prepublishOnly` script will just run
our lint script for now. Add a prepublishOnly script as follows:

```Json
  "scripts": {
    "prepublishOnly": "npm run lint",
    "lint": "semistandard \*.js",
    "test": "node test.js"
  }
```

Typically, module authors will include rerunning their test suite in their `prepublishOnly` scripts:

```Json
"prepublishOnly": "npm run lint && npm test",
```

### Using .npmignore and package.json "files" properties

As with a `.gitignore` file, which specifies which files should not be tracked or committed to a
repository, `.npmignore` omits the files listed in it from the package. Files of the `.npmignore`
type are not mandatory, and if you do not have one but do have a `.gitignore` file, then `npm` will
omit the files and directories matched by the `.gitignore` file. The `.npmignore` file will override
`.gitignore` if such a file exists.

The types of files and directories that are often added to `.npmignore` files are test files. If you have
a particular large test suite in terms of size, then you should consider excluding these files by adding
them to your `.npmignore` file. Users consuming your module do not tend to need the test suite
bundled into their applications – excluding these and other superfluous files reduces the size of your
module for all consumers.

A `.npmignore` file that excludes just the test directory would look like this:

```bash
# Dependency directories
test/
```

Remember that once the `.npmignore` file is created, it will be considered the **source of truth (SOT)**
of which files should be ignored from the `npm` package. It’s worth going through your .gitignore
file and ensuring items that you’ve added there are also added to `.npmignore`.

In the `package.json` file, you can also define a `"files"` property that allows you to specify an
array of file paths or patterns that should be included when the package is published. Rather than an
exclusion list, this acts as an inclusion list for what is published.

For instance, if you have a Node.js module containing various utility functions, but you only want
to expose the main functionality and documentation, you can specify `"files": ["lib/",
"docs/", "README.md"]` in your `package.json` file. This ensures that only the files within
the specified directories and the `README.md` file are included when users install your package, while
all other internal files or directories are excluded from the published package.

Providing an allow list by defining `"files"` in the `package.json` file rather than an exclusion
list with `.npmignore` may be preferable as it removes the risk of forgetting to exclude a file in the
`.npmignore` file.

To ensure that your package includes only the desired files upon publication, you can execute the
`npm pack` command in your local environment. This command creates a tarball in your current working
directory, mirroring the process used for publishing.

**Important note:**
While TypeScript and other transpilers are not covered in detail in this book, it is typical when
publishing to `npm` to only publish the output files, such as JavaScript files, and not the source
files, such as TypeScript files. This practice ensures that the package consumers receive only
the necessary files to run the module. To achieve this, you can use the `.npmignore` file
or the `"files"` property in `package.json` to exclude source files and include only the
compiled output.

### Private registries

The `npm` CLI supports being configured to point to a private registry. A private registry is a registry
that has been set up with some form of access control. Typically, these are set up by businesses and
organizations that wish to keep some of their code off the public registry, potentially due to policy
restrictions determined by their business. This enables the business to share its modules among
members of the same organization while adhering to the business policy. Equally, a private registry
can be used as a caching mechanism.

You can change which registry you’re pointing to with the following command:

```Bash
$ npm config set registry https://registry.your-registry.npme.io/
```

You can see which registry you’re pointing to with the following command:

```Bash
$ npm config get registry
https://registry.npmjs.org/
```

Note that these both use the `npm config` command. You can list all your `npm config` settings with the following:

```Bash
$ npm config list
; "user" config from /Users/bgriggs/.npmrc
; node bin location = /Users/bgriggs/.nvm/versions/node/v22.9.0/bin/
node
; node version = v22.9.0
; npm local prefix = /Users/bgriggs/Node.js-Cookbook/Chapter05/
temperature-converter
; npm version = 10.2.4
; cwd = /Users/bgriggs/Node.js-Cookbook/Chapter05/temperature-
converter
; HOME = /Users/bgriggs
; Run `npm config ls -l` to show all defaults
```

A `.npmrc` file is a configuration file for `npm` that can be used to set various `npm` configurations
globally or on a per-project basis. This file allows you to persistently configure `npm` settings, such as
registry URLs and authentication tokens. For example, to point `npm` to a private registry, you can add
the following line to a `.npmrc` file:

```Bash
registry= https://registry.your-registry.npme.io/
```

There are many other configurable settings and customizations in this file; refer to the `npm` documentation
for more information: <https://docs.npmjs.com/cli/v10/configuring-npm/npmrc>.
