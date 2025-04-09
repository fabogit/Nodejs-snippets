# Testing enables you to identify bugs in your code quickly and efficiently. Test cases should be written

to verify that each piece of code yields the expected output or results. The added benefit is that these
tests can act as a form of documentation for the expected behaviors of your applications.

Unit testing is a type of testing where individual units of code are tested. Small unit tests provide a
granular specification for your program to test against. Ensuring your code base is covered by unit
tests aids the development, debugging, and refactoring process by providing a baseline measure of
behavior and quality. Having a comprehensive test suite can lead to identifying bugs sooner, which
can save time and money since the earlier a bug is found, the cheaper it is to fix.

## Testing with node:test

Node.js introduced a built-in test runner in version 18 as an experimental feature, subsequently making
it stable in version 20. This addition marked a significant shift in the Node.js runtime development
philosophy away from the “small core” to adding more utilities into the runtime itself.

The decision to include a built-in test runner was influenced by a broader industry trend toward
including more built-in tooling in programming languages and runtimes. This shift is partly in response
to concerns about security, such as the risks associated with dependency vulnerabilities. By providing a
native test solution, Node.js aims to make testing a first-class citizen within its environment, reducing
the potential attack surface provided by third-party test runners.

The built-in test runner in Node.js does not have as extensive an API as is provided by the many
common and popular test frameworks, such as Jest. It was designed to be a minimal and lightweight,
yet functional, testing utility without the overhead of additional features and configurations.

We can run the tests by entering the following command in our terminal window:

```Bash
$ node --test
```

Expect to see the following output indicating that the first test passed and the second test failed:

```Bash
▶ add
  ✔ add integers (1.812208ms)
  ✖ add strings (2.565671ms)
✖ add (7.132125ms)
ℹ tests 3
ℹ suites 0
ℹ pass 1
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 200.224151

✖ failing tests:

test at calculator.test.mjs:13:10
✖ add strings (2.565671ms)
  AssertionError [ERR_ASSERTION]: '12' == 3
  ...
```

We’ve learned how we can write unit tests for our application using the node:test module. We’ve
executed these tests and produced a **Test Anything Protocol (TAP)** summary of the test results.

## How it works…

In the provided example utilizing the `node:test` built-in module for Node.js, we start by importing
the necessary modules using the ESM syntax. This includes test from `node:test` for testing
framework functionalities, `assert` from `node:assert` for assertions, and the `add()` function
from a local module, `calculator.mjs`, which is the function under test.

**Important note:**
It’s crucial to import the `node:test` module by using the `node:` scheme prefix, like this:
`const test = require('node:test');`. This module is one of the first to only be
exposed via the `node:` prefix. Attempting to import it without the `node:` prefix, as in
`const test = require('test');`, will result in an error.

The tests are structured using the `test()` function, where each test case is encapsulated within an
asynchronous function. Within each test, subtests are defined using `await t.test(...)`, which
helps organize the tests hierarchically and manage multiple assertions or setup processes cleanly within
one test block. For asserting conditions, `assert.strictEqual()` is employed to compare the
expected and actual outcomes, ensuring that both type and value are equal.

The `node:assert` module in Node.js provides a set of assertion functions for verifying invariants,
primarily used for writing tests. Key assertions include `assert.strictEqual()`, which checks
for strict equality between the expected and actual values, and `assert.deepStrictEqual()`,
which performs a deep equality comparison of objects and arrays. The module also offers `assert.ok()`
to test if a value is **truthy** and `assert.rejects()` and `assert.doesNotReject()`
for handling promises that should or should not reject. This suite of assertions allows developers to
enforce expected behaviors and values in code. A full list of available assertions is detailed in the Node.
js assert module documentation: <https://nodejs.org/docs/latest/api/assert.html#assert>.

To run these tests, the script is executed directly with Node.js by running `node --test` in the
command line. This approach directly outputs the test results to the console, indicating which tests have
passed or failed. This method of using Node.js’s built-in testing tools simplifies the testing process by
eliminating the need for external libraries – reducing overhead and minimizing third-party dependencies.

In the recipe, our test results were output using the `spec` format. When using the `node:test`
module with a **terminal interface (TTY)**, the default output reporter is set to `spec`. The `spec`
reporter formats test results in a human-readable manner. If the standard output is not a TTY, the
module defaults to using the `tap` reporter, which outputs the test results in TAP format.

It’s possible to specify alternate test reporter output using the `--test-reporter` command-line flag.
Details of the available reporters can be found in the Node.js documentation:
<https://nodejs.org/docs/latest-v22.x/api/test.html#test-reporters>.

## There’s more…

To further enhance your understanding of the core `node:test` module, let’s explore the default file
patterns the test runner uses to locate and execute tests, along with additional features that streamline
the testing process.

### Understanding Node.js default test file patterns

The Node.js test runner automatically finds and runs test files based on their names by looking for
files that match specific patterns – essentially, indicators that a file is a test. The patterns use wildcards
(`*`) and optional groups (`?(...)`) to include various filenames and extensions. The double asterisk
(`**`) means that Node.js searches all directories and subdirectories, so no matter where your test files
are, they’ll be found as long as they match the patterns.

Here are common patterns the Node.js test runner searches for by default:

- `**/*.test.?(c|m)js`: This finds files ending with `.test.js`, `.test.cjs`, or `.test.mjs` in any directory

- `**/*-test.?(c|m)js`: Like the first pattern, but for files ending with `-test.js`, `-test.cjs`, or `-test.mjs`

- `**/*_test.?(c|m)js` catches files ending with `_test.js`, `_test.cjs`, or `_test.mjs`

- `**/test-_.?(c|m)js` looks for files starting with `test-` and ending with `.js`, `.cjs`, or `.mjs`

- `**/test.?(c|m)js` matches files named exactly `test.js`, `test.cjs`, or `test.mjs`

- `**/test/**/*.?(c|m)js` digs into any test directory and finds files with `.js`, `.cjs`,
  or `.mjs` extensions in any subdirectory

To make sure Node.js can find and run your tests without extra configuration, it is advisable to name your
test files following these patterns. It keeps your project organized and aligns with common Node.js practices.

### Filtering tests

With the `node:test` module, there are several options for filtering tests to manage which ones are executed
during a test run. This flexibility is useful for focusing on specific tests during development or debugging:

- **Skipping tests:** Tests can be skipped using the `skip` option or the test contexts `skip()`
  method. This is useful for temporarily disabling a test without removing it from the code
  base. For example, marking a test with `{ skip: true }` or using `t.skip()` within the
  `test()` function will prevent its execution:

  ```JavaScript
  test('add strings', { skip : true }, () => {
      assert.equal(add('1', '2'), 3);
  });
  ```

- **Marking tests as todo:** When a test is not yet implemented or if it’s known to be flaky, it can be
  marked as `todo`. These tests will still run, but their failures won’t count against the test suite’s
  success. Using the `{ todo: true }` option or `t.todo()` can annotate these tests effectively.

- **Focusing on specific tests:** The `{ only: true }` option is used to focus on running specific
  tests, skipping all others not marked with this option. This is particularly useful when needing
  to isolate a test for scrutiny without running the entire suite.

- **Filtering by test name:** Using the `--test-name-pattern` command-line option, tests can
  be filtered by their names. This is useful when you want to run a subset of tests that match a
  specific naming pattern or convention. Patterns are treated as regular expressions. For example,
  running the test suite with `--test-name-pattern="add"` would only execute tests with
  `"add"` in their name.

### Collecting code coverage

**Code coverage** is a key metric used to evaluate the extent to which source code is executed during
testing, helping developers identify untested parts of their code base. In Node.js, enabling code coverage
is straightforward, but it’s important to note that this feature is currently experimental.

You can enable it by launching Node.js with the `--experimental-test-coverage` command-
line flag. This setup automatically collects coverage statistics, which are reported after all tests are
completed. Coverage for Node.js core modules and files within `node_modules` directories is not
included in the report.

It’s possible to control which lines are included for code coverage by using annotations:

- `/* node:coverage disable */` and `/* node:coverage enable */`, which
  exclude specific lines or blocks of code from being counted
- `/* node:coverage ignore next */` to exclude the following line

- `/* node:coverage ignore next n */` to exclude the following `n` lines

Coverage results can be summarized by built-in reporters such as `tap` and `spec`, or detailed through
the `lcov` reporter, which generates a `lcov` file suitable for in-depth analysis.

**Important note:**
The current implementation of `--experimental-test-coverage` has limitations, such
as the absence of source map support and the inability to exclude specific files or directories
from the coverage report.

To collect code coverage in the example from the recipe, you can run the following command:

```Bash
$ node --test --experimental-test-coverage
```
