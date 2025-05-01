# Deploying Node.js Microservices

The term **microservices** is used to describe applications that have been built based on the microservice
architecture paradigm. This architecture encourages larger applications to be built as a set of smaller
modular applications, where each application focuses on one key concern. Microservice architectures
are a contrast to the monolithic architectures of the past. **Monolith** is a term given to an application
that handles many disparate concerns.

There are numerous benefits to adopting a microservice architecture. Ensuring that an application
only serves one purpose means that the application can be optimized to best serve that purpose.
Microservices help to decouple various parts of a system, which can result in easier debuggability if
something goes wrong. Adopting a microservice architecture also enables you to scale different parts
of the system independently.

There are not only technical benefits to adopting a microservice architecture. Separating microservices
into separate code bases can enable smaller teams to have autonomy over the microservices they’re
responsible for. Many microservice-based systems are written in a variety of frameworks and languages.
Development teams can choose the language and framework they feel is best suited for their microservice.

Microservices can, however, increase complexity due to the management of multiple services, which
requires mature DevOps practices and comprehensive monitoring. For this reason, microservices are
often not suitable for simple applications where the management overhead outweighs the benefits.

Node.js microservices commonly expose **RESTful** APIs. **Representational State Transfer (REST)** is
very popular. A RESTful API exposes its API via HTTP, making appropriate use of the HTTP verbs.
For example, if a blogging service exposed a RESTful API, you’d expect it to expose an endpoint to
which you could send an HTTP GET request to retrieve a blog post. Similarly, it would likely expose
an endpoint to which you could send an HTTP POST request, with data, to publish new blogs.

Microservices and container technologies go hand in hand. Cloud and container technologies are
growing in adoption, with Docker and Kubernetes, which are the leading choices for deploying
microservice-based applications.

Here we will:

- Generating a microservice with LoopBack

- Consuming a microservice

- Building a Docker container

- Publishing a Docker image

- Deploying to Kubernetes
