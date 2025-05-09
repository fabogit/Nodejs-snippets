# Testing with Node.js

Testing enables you to identify bugs in your code quickly and efficiently. Test cases should be written
to verify that each piece of code yields the expected output or results. The added benefit is that these
tests can act as a form of documentation for the expected behaviors of your applications.

Unit testing is a type of testing where individual units of code are tested. Small unit tests provide a
granular specification for your program to test against. Ensuring your code base is covered by unit
tests aids the development, debugging, and refactoring process by providing a baseline measure of
behavior and quality. Having a comprehensive test suite can lead to identifying bugs sooner, which
can save time and money since the earlier a bug is found, the cheaper it is to fix.

Here we will start by introducing some key techniques with the test runner built into recent
versions of Node.js. We’ll also explore some popular testing frameworks. Testing frameworks provide
components and utilities such as test runners for running automated tests. The later recipes in this
chapter will introduce other testing concepts – including **stubbing, user interface (UI)** testing, and
how to configure **continuous integration (CI)** testing.

Here we will cover the following recipes:

- Testing with node:test

- Testing with Jest

- Stubbing HTTP requests

- Using Puppeteer

- Configuring CI tests
