# Testing with Jest

Jest is a widely adopted open source JavaScript testing framework developed by Facebook. It is particularly
favored for testing React applications, though its versatility extends to Node.js environments. Jest is
an opinionated testing framework with a host of bundled features.

In this guide, we will explore how to effectively write and structure tests using Jest. You’ll learn the
key principles of Jest and how to set up your testing environment. Additionally, we’ll explore Jest’s
capabilities in measuring and reporting test coverage to help you understand how well your code
base is covered by tests.

We can run the test by entering the `npm test` command in the terminal. Jest will print a summary of our test results:

```Bash
pnpm test

> testing-with-jest@1.0.0 test
> jest

 PASS  ./textUtils.test.js
  textUtils
    ✓ converts "HELLO WORLD" to all lowercase (4 ms)
    ✓ converts "hello world" to all uppercase (1 ms)
    ✓ capitalizes the first letter of "hello"
    ✓ return empty string as it is (1 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.574 s, estimated 1 s
Ran all test suites.
```

Jest provides a built-in code coverage feature. Running this will show us which lines of our
program have been covered by the test case. You can enable coverage reporting by passing the
`--coverage` flag to the Jest executable. Enter the following command in your terminal to
reference the installed Jest executable and report code coverage:

```Bash
./node_modules/jest/bin/jest.js --coverage
```

Expect to see the following output:

```Bash
 PASS  ./textUtils.test.js
  textUtils
    ✓ converts "HELLO WORLD" to all lowercase (5 ms)
    ✓ converts "hello world" to all uppercase (1 ms)
    ✓ capitalizes the first letter of "hello" (1 ms)
    ✓ return empty string as it is (1 ms)

--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------|---------|----------|---------|---------|-------------------
All files     |     100 |      100 |     100 |     100 |
 textUtils.js |     100 |      100 |     100 |     100 |
--------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.868 s, estimated 1 s
Ran all test suites.
```

## How it works…

The first line of our `textUtils.test.js` file imports our `textUtils.js` module, allowing
us to call it when testing.

We organized our tests using Jest’s `describe()` and `test()` functions. The `describe()` function
is used to define a collection of tests. The `describe()` method takes two parameters. The first is
a name for the test group, and the second parameter is a callback function, which can contain test
cases or nested `describe()` blocks.

Jest’s `test()` syntax is used to define a test case. The `test()` method accepts two parameters. The
first is the test name, and the second is a callback function that contains the test logic.

The test logic for this program had just one line, which asserts that when we call `uppercase('hello world')`,
a `HELLO WORLD` value is returned as expected. The assertion uses Jest’s `Expect` bundled
assertion library (<https://www.npmjs.com/package/expect>). We used the `toBe()`
assertion from the `Expect` library to equate the two values.

`Expect` exposes many assertion methods, including `toBe()`, `toContain()`, `toThrow()`, and
others. A full list of assertions is defined in the `Expect` section of Jest’s API documentation
<https://jestjs.io/docs/en/expect.html#methods>.

It’s also possible to invert assertions by adding `.not` to our statements, as in the following example:

```JavaScript
expect(uppercase('hello')).not.toBe('hello');
```

To run our test cases, we call the `jest` test runner, which is located within our `node_modules`
directory. The Jest executable runs the tests, automatically looking for files containing `test.js`. The
runner executes our tests and then generates an output summary of the results.

In the final step of the recipe, we enabled Jest’s code coverage reporting. Code coverage is a measure
of how many lines of our program code are touched when executing our tests. 100% code coverage
means that every line of your program is covered by the test suite. This helps you easily detect bugs
introduced by code changes. Some developers and organizations set acceptable thresholds for code
coverage and put restrictions in place so that the code coverage percentage cannot be regressed.

## There’s more…

Jest provides more features **out of the box (OOTB)** than some of the other popular Node.js test
libraries. Let’s look at a couple of them.

### Setup and teardown

Jest provides setup and teardown functionality for tests. Setup steps can be run before each or all tests
using the `beforeEach()` and `beforeAll()` functions respectively. Similarly, teardown steps
can be run after each or all tests with the `afterEach()` and `afterAll()` functions respectively.

The following pseudocode demonstrates how these functions can be used:

```JavaScript
describe('test', () => {
  beforeAll(() => {
    // Runs once before all tests
  });
  beforeEach(() => {
    // Runs before each test
  });
  afterEach(() => {
    // Runs after each test
  });
  afterAll(() => {
    // Runs after all tests
  });
});
```

### Mocking with Jest

Mocks enable you to test the interaction of your code or functions without having to execute the code.
Mocks are often used in cases where your tests rely on third-party services or APIs, and you do not want to
send real requests to these services when running your test suite. There are benefits to **mocking**, including
faster execution of test suites and ensuring your tests are not going to be impacted by network conditions.

Jest provides mocking functionality OOTB. We can use a mock to verify that our function has been
called with the correct parameters, without executing the function.

For example, we could change the test from the recipe to mock the `uppercase()` module with
the following code:

```JavaScript
describe('uppercase', () => {
  test('uppercase hello returns HELLO', () => {
    uppercase = jest.fn(() => 'HELLO');
    const result = uppercase('hello');
    expect(uppercase).toHaveBeenCalledWith('hello');
    expect(result).toBe('HELLO');
  });
});
```

The `jest.fn(() => 'HELLO');` method returns a new mock function. We assign this to a
variable named `uppercase`. The parameter is a callback function that returns the string `'HELLO'`
– this is to demonstrate how we can simulate a function’s return value.

The `.toHaveBeenCalled()` method from `Expect` verifies that our mock function was called
with the correct parameter. If, for some reason, you cannot execute a function in your test suite, you
can use mocks to validate that the function is being called with the correct parameters.

### Testing asynchronous code

Testing asynchronous code is essential in ensuring that Node.js applications perform as expected,
especially when dealing with operations such as API calls, database transactions, or any processes that
depend on promise resolution or callbacks. Jest provides a clear and straightforward way to handle
these asynchronous operations in your tests, ensuring they complete before making assertions.

One of the most common methods to test asynchronous code in Jest is by using the `async/await`
syntax along with Jest’s `.resolves` and `.rejects` matchers. For example, consider a fetchData()
function that returns a promise resolving to some data:

```JavaScript
function fetchData() {
    return new Promise((resolve) => {
        setTimeout(() => resolve('hello'), 1000);
    });
}
```

You can write a Jest test to verify that `fetchData()` resolves to the expected value:

```JavaScript
test('data is hello', async () => {
    await expect(fetchData()).resolves.toBe('hello');
});
```

This test will wait for the `fetchData()` promise to resolve, thanks to the `await` keyword, and
then check that the resolved value matches `'hello'`.

Alternatively, if you’re working with asynchronous code that uses callbacks, you can use Jest’s `done()`
callback to handle this pattern:

```JavaScript
function fetchDataCallback(callback) {
    setTimeout(() => { callback('hello');  }, 1000);
}
test('the data is hello', done => {
    function callback(data) {
        try {
            expect(data).toBe('hello');
            done();
        } catch (error) {
            done(error);
        }
    }
    fetchDataCallback(callback);
});
```

In this test, `done()` is called once the callback receives data, signaling to Jest that the test is complete.
If there is an error in your expectation, calling `done()` with an `error` argument allows Jest to
handle the error properly.
