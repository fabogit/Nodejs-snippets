# Stubbing HTTP requests

It is common for the Node.js applications you’re building to rely on and consume an external service
or API. When unit testing, you do not typically want your test to send a request to an external service.
Requests to the external service you’re consuming are metered or rate-limited, and you do not want
your test cases to consume the allowance.

It’s also possible that your tests would require access to service credentials. This means every developer
on the project would need access to those credentials before they could run the test suite.

To be able to unit test your code without sending a request to an external service, you can fake a
request and response. This concept is known as stubbing. Stubbing can be used to mimic API calls,
without sending the request. Stubbing comes with the additional benefit of reducing any request
latency, potentially making the tests run faster than if they were to send real requests.

The test concepts of stubbing and mocking are often confused. Stubbing provides predefined responses
to isolate the unit under test, while mocking also verifies interactions by ensuring methods are called
with certain parameters.

We will be using `Sinon.js`, which is a library that provides stubbing functionality.

We can run the test to check that it passes:

```Bash
$ node --test --test-reporter=tap
```

`Sinon.js` is used to simulate the behavior of a function that fetches user data from GitHub’s
API. Instead of executing an actual network request, which can be slow and consume limited API
request quotas, we substitute the global `fetch()` method with a “stub.” This `stub()` function is
designed to resolve with a predetermined object that represents a GitHub user’s data.

Initially, the necessary modules and utilities are imported: `node:assert` for assertions, `node:test`
to define the test case, and `sinon` for creating a stub. We also import the `getGitHubUser()`
function we plan to test.

`Sinon.js` is used to create a stub for the global `fetch()` function. The stub is designed to return a fake
response that resembles what would be expected from the actual GitHub API. This fake response is a
_promise_ that resolves to an object with a `json()` method. This, in turn, returns a promise that resolves
to an object containing the `id`, `login`, and `name` properties of our test GitHub user – mimicking
the format of the GitHub API response.

When `getGitHubUser()` is invoked with the `octokit` username, the stubbed `fetch()`
function intercepts the call and returns a fake response. As a result, `getGitHubUser()` processes
this response as if it were a real one from the API but without incurring network latency. After the
simulated API call, the actual `user` object is awaited and then checked against the expected values
to confirm that the `getGitHubUser()` function handles the response as expected.

After the assertions, `sinon.restore()` is called, which reinstates the original `fetch()` method.
This ensures that subsequent tests or other parts of the code base are not affected by the stubbing of
the `fetch()` method in this test. This practice ensures the isolation of the test and prevents side
effects on other tests.

This recipe provided a high-level view of the stubbing process by demonstrating how to stub a single
method with `Sinon.js`. Stubbing can be used to replace any part of the system under test, from individual
functions to entire modules, which can be particularly useful in a microservice architecture where
services may depend on responses from other services.
