# Consuming a microservice

Here we will create an Express.js web application that will consume the `loopback-bookstore` microservice created in the previously.
This will demonstrate how modern web architectures are implemented based on the microservice pattern.

We will also be creating a frontend web application, using the Express.js generator to create a base for
our web application. For more information on the Express.js generator, visit
<https://expressjs.com/en/starter/generator.html>.

The web application should enable us to view the inventory and add a book to the inventory.

Start your `loopback-bookstore` microservice. Do this from within the `loopback-bookstore` directory:
`$ npm start`

Now, in a separate terminal window, start the `bookstore-web-app` application with the
following command. We’ll also pass a `PORT` environment variable to the start command to
set a custom port. Express.js web applications default to port `3000`, but this will already be in
use by our `loopback-bookstore` microservice, so we need to supply an alternative port.
Run the following command from the `bookstore-web-app` directory:
`$ PORT=8080 npm start`

Navigate to http://localhost:8080/inventory in your browser.

Now we can try adding a book to the inventory. Populate the `title` and `author` input fields
and then click the **Submit** button. After submitting, you should expect to see the book you
submitted added to the inventory.

We’ve successfully built a frontend web application that communicates with our
`loopback-bookstore microservice`.

## How it works…

Here we implemented a frontend web application layer that was backed by our `loopback-bookstore` microservice.

When our `/inventory` web page loads, under the covers, the Express.js web frontend queries the
data from the loopback microservice.

Our Express.js server sends an HTTP POST request to the <http://localhost:3000/books>
endpoint. The request is supplied with the HTML form data.

Once the request to the LoopBack microservice is complete, the Express.js web application redirects
to the `/inventory` route. This refreshes the template, which will then list the newly added book.

This architecture demonstrates how you can modularize an application by building the backend API,
in this case, `loopback-microservice`, separately from the frontend web application. This enables
both applications to be scaled independently and keeps the code loosely coupled.

For larger systems, it’s common to have many microservices communicating together.
