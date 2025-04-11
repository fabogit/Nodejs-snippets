# Using Puppeteer

UI testing is a technique used to identify issues with **graphical UIs (GUIs)**, particularly in web
applications. Although Node.js is primarily a server-side platform, it is frequently used to develop
web applications, where UI testing plays a critical role.

For example, if you have an application containing an HTML form, you could use UI testing to validate
that the HTML form contains the correct set of input fields. UI testing can also validate interactions
with the interface – such as simulating button clicks or hyperlink activations.

Puppeteer is an open source library that provides a headless Chromium instance, which can be
programmatically interacted with to automate UI tests. It is particularly useful for Node.js environments
because of its native support and ease of integration.

In the recipe, we will use Puppeteer (<https://pptr.dev/>) to perform UI testing on the
<http://example.com/> website. However, other popular alternatives for UI testing in Node.js include
Selenium, Cypress, and Playwright. While the high-level principle and purpose of each of these tools
are similar, each tool has its strengths and can be chosen based on specific needs such as cross-browser
testing, ease of setup, and integration capabilities.

Enter the following command in your terminal to run the test:

```Bash
$ node test.js
Title value: Example Domain
```

In the recipe, we used Puppeteer to create a test that verifies that the <https://example.com>
web page returns the heading `'Example Domain'` within an `h1` HTML element tag. Most of
the Puppeteer APIs are asynchronous, so we used the `async/await` syntax throughout the recipe.

When we call `puppeteer.launch()`, Puppeteer initializes a new headless Chrome instance that we
can interact with via JavaScript. As testing with Puppeteer has the overhead of a headless Chrome instance,
using it for testing can be less performant than other types of tests. However, as Puppeteer is interacting with
Chrome under the hood, it provides a very close simulation of how end users interact with a web application.

Once Puppeteer was launched, we initialized a `page` object by calling the `newPage()` method on
the `browser` object. The `page` object is used to represent a web page. On the `page` object, we then
called the `goto()` method, which is used to tell Puppeteer which URL should be loaded for that object.

The `$eval()` method is called on the page object to extract values from the web page. In the
recipe, we passed the `$eval()` method `h1` as the first parameter. This instructs Puppeteer to identify
and extract the HTML `<h1>` element. The second parameter is a callback function, which extracts
the `innerText` value of the `<h1>` element. For <http://example.com>, this extracted the
`'Example Domain'` value.

At the end of the `runTest()` function, we called the `browser.close()` method to instruct
Puppeteer to end the Chrome emulation. This was necessary since Puppeteer will continue emulating
Chrome with the Node.js process never exiting.

This is a simplistic example, but it serves as a foundation for understanding how UI testing automation
works. This test script is easily extendable, allowing the simulation of more complex user interactions
such as form submissions, navigation, and error handling.

It’s also possible to run Puppeteer in non-headless mode. You can do this by passing a parameter to
the `launch()` method:

```JavaScript
   const browser = await puppeteer.launch({
        headless: false
    });
```

In this mode, when you run your tests, you will see the Chromium UI and can follow your tests while
they are executing. This can be useful when debugging your Puppeteer tests.
