# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)

This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).

## Building a Docker container

Once we have a Node.js microservice, we need to package it ready for deployment to the cloud. Cloud
and container technologies go hand in hand, and one of the most prevalent container technologies
is Docker.

Docker is a tool used for creating, deploying, and running applications with containers. A container
enables you to package up your application with all its dependencies. A container is often said to be
like a virtual machine, the key difference being that Docker allows applications to reuse the same
Linux kernel, whereas a virtual machine virtualizes the whole operating system.

The key benefit to containerizing a microservice is that it is encapsulated, which means that the
container holds everything that the microservice requires in order to run. This helps make the
application portable and consistent across machines.

Container technologies such as Docker are seen as the de facto tools for deploying to modern cloud
environments, often combined with a container orchestrator such as Kubernetes.

Docker and Kubernetes are large and complex technologies. Here we will focus on demonstrating
how to leverage Docker and Kubernetes to deploy Node.js microservices.
Refer to the following links for more detailed information about Docker and Kubernetes:

- Kubernetes overview: <https://kubernetes.io/docs/tutorials/kubernetes-basics/​>

- Kubernetes setup guide: <https://kubernetes.io/docs/setup/>

Here we’ll be packaging a sample Node.js microservice into a Docker container.

Start by creating a `Dockerfile` file and a `.dockerignore` file

We’re now ready to build the microservice. We do this by using the `docker build` command,
along with `fastify-microservice` as a tag for our image:
`$ docker build --tag fastify-microservice .`

Enter the following command in your terminal window to list all of your Docker images. You
should expect to see the `fastify-microservice` Docker image in the list:

```Bash
docker images

REPOSITORY                    TAG       IMAGE ID       CREATED         SIZE
fastify-microservice          latest    066e18954f55   8 seconds ago   1.17GB
```

Now we can run the Docker image as a Docker container, passing the `--publish` flag to
instruct Docker to map port `3000` from within the container to port `3000` on our local
machine. Enter the following command:

```Bash
docker run --publish 3000:3000 fastify-microservice

> fastify-microservice@1.0.0 start
> fastify start -l info app.js

{"level":30,"time":1746134034813,"pid":19,"hostname":"04994a9b2e7a","msg":"Server listening at http://127.0.0.1:3000"}
{"level":30,"time":1746134034814,"pid":19,"hostname":"04994a9b2e7a","msg":"Server listening at http://172.17.0.2:3000"}
```

You should be able to navigate to <http://localhost:3000/example> and see the
**this is an example** output.

Press _Ctrl + C_ in your terminal window to stop your container.

We’ve now successfully built our first containerized microservice.

### How it works…

Containers enable you to package your application into an isolated environment. `Dockerfile` is
used to define the environment. The environment should include the libraries and dependencies that
are required to run the application code.

Let’s examine the contents of the `Dockerfile` file:

- `FROM node:22`: The node instruction is used to initialize a new build stage. A `Dockerfile`
  file must start with a `FROM` instruction pointing to a valid Docker image that can be used as a
  base for our image. In this example, the image is based on the Docker Official Node.js image.

- `RUN apt-get update...`: This line instructs Docker to update the containers’ OS
  dependencies using the **Advanced Package Tool (APT)**, which is Debian’s default package
  manager. It’s important that OS dependencies are up to date to ensure that your dependencies
  contain the latest available fixes and patches.

- `COPY package*.json ./`: This copies the `package.json` and `package-lock.json` files, should they exist, into the container.

- `RUN npm install --production`: This executes the `npm install` command
  within the container based on the `package*.json` files copied earlier into the container.
  `npm install` must be run within the container as some dependencies may have native
  components that need to be built based on the container’s OS. For example, if you’re developing
  locally on macOS and have native dependencies, you will not be able to just copy the contents
  of `node_modules` into the container, as the native macOS dependencies will not work in
  the Debian-based container.

- `COPY . /app`: This copies our application code into the container. Note that the `COPY`
  command will ignore all patterns listed in the `.dockerignore` file. This means that the
  `COPY` command will not copy `node_modules` and other information to the container.

- `ENV PORT 3000`: This sets the `PORT` environment variable in the container to `3000`.

- `EXPOSE 3000`: The `EXPOSE` instruction is used as a form of documentation as to which
  port is intended to be published for the containerized application. It does not publish the port.

- `USER node`: This instructs Docker to run the image as the `node` user. The `node` user is
  created by the Docker Official Node.js image. When omitted, the image will default to being
  run as the root user. You should run your containers as an unprivileged (non-root) user where
  possible as security mitigation.

- `CMD ["npm", "start"]`: This executes the command to start the application.

The ordering of the commands in `Dockerfile` is important. For each command in the `Dockerfile`
file, Docker creates a new layer in the image. Docker will only rebuild the layers that have changed,
so the ordering of the commands in the `Dockerfile` file can impact rebuild times. It is for this
reason that we copy the application code into the container after running `npm install`, as we’re
more commonly going to be changing the application code as opposed to changing our dependencies.

It’s possible to view the Docker layers for an image using the `docker history` command. For
example, `$ docker history fastify-microservice` will output the layers of our
`fastify-microservice` image:

```Bassh
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
066e18954f55   8 minutes ago   /bin/sh -c #(nop)  CMD ["npm" "start"]          0B
bf79fa739cce   8 minutes ago   /bin/sh -c #(nop)  USER node                    0B
4bea84f40088   8 minutes ago   /bin/sh -c #(nop)  EXPOSE 3000                  0B
c9d37a2cea77   8 minutes ago   /bin/sh -c #(nop)  ENV PORT=3000                0B
17e6424a3450   8 minutes ago   /bin/sh -c #(nop) COPY dir:172bfc4c8bca10ce9…   16.9kB
9d3aeee457d9   8 minutes ago   /bin/sh -c npm install --production             25.2MB
c13a0c9394a9   8 minutes ago   /bin/sh -c #(nop) COPY file:137a2eccd9bdb247…   606B
7ddc40bb3dca   8 minutes ago   /bin/sh -c apt-get update     && apt-get dis…   19.6MB
f7d384c28b77   8 minutes ago   /bin/sh -c #(nop) WORKDIR /app                  0B
ef7d9f8cb930   8 days ago      CMD ["node"]                                    0B        buildkit.dockerfile.v0
<missing>      8 days ago      ENTRYPOINT ["docker-entrypoint.sh"]             0B        buildkit.dockerfile.v0
<missing>      8 days ago      COPY docker-entrypoint.sh /usr/local/bin/ # …   388B      buildkit.dockerfile.v0
<missing>      8 days ago      RUN /bin/sh -c set -ex   && export GNUPGHOME…   5.34MB    buildkit.dockerfile.v0
<missing>      8 days ago      ENV YARN_VERSION=1.22.22                        0B        buildkit.dockerfile.v0
<missing>      8 days ago      RUN /bin/sh -c ARCH= && dpkgArch="$(dpkg --p…   186MB     buildkit.dockerfile.v0
<missing>      8 days ago      ENV NODE_VERSION=22.15.0                        0B        buildkit.dockerfile.v0
<missing>      8 days ago      RUN /bin/sh -c groupadd --gid 1000 node   &&…   8.94kB    buildkit.dockerfile.v0
<missing>      15 months ago   RUN /bin/sh -c set -ex;  apt-get update;  ap…   588MB     buildkit.dockerfile.v0
<missing>      15 months ago   RUN /bin/sh -c set -eux;  apt-get update;  a…   177MB     buildkit.dockerfile.v0
<missing>      24 months ago   RUN /bin/sh -c set -eux;  apt-get update;  a…   48.4MB    buildkit.dockerfile.v0
<missing>      24 months ago   # debian.sh --arch 'amd64' out/ 'bookworm' '…   117MB     debuerreotype 0.15
```

The `$ docker build --tag fastify-microservice .` command builds the Docker
image, based on the instructions in the `Dockerfile` file in the current directory.

To run the image, we call `docker run --publish 3000:3000 fastify-microservice`.
We pass this command the name of the image we’d like to run, and also the port we wish to expose.
The `--publish 3000:3000` option maps port `3000` on your host machine to port `3000` on
the container, ensuring that any traffic sent to port `3000` on the host is forwarded to port `3000` in
the container.

### There’s more…

When creating a Docker image, it’s important to make it as small as possible. It’s considered good
practice for your production image to only contain the dependencies and libraries required to run
the application in production. To create a smaller image, we can leverage Docker’s multistage builds
capability (<https://docs.docker.com/develop/develop-images/multistage-build/>).

Docker multistage builds allow us to define multiple Docker images in the same `Dockerfile` file.
For Node.js applications, we can split the _build_ and _run_ steps into separate containers. The result is
that the final production container, the `run` container, will be a smaller and lighter-weight container.

We could use the following multistage `Dockerfile` file to containerize our `fastify-microservice`:

```Dockerfile
FROM node:22

WORKDIR "/app"

RUN apt-get update \
  && apt-get dist-upgrade -y \
  && apt-get clean \
  && echo 'Finished installing dependencies'

COPY package*.json ./

RUN npm install --production

FROM node:22-slim

WORKDIR "/app"

RUN apt-get update \
  && apt-get dist-upgrade -y \
  && apt-get clean \
  && echo 'Finished installing dependencies'

COPY --from=0 /app/node_modules /app/node_modules
COPY . /app

ENV NODE_ENV production
ENV PORT 3000
USER node
EXPOSE 3000

CMD ["npm", "start"]
```

Observe that there are two `FROM` instructions in the `Dockerfile` file, indicating that there are
two build stages.

The first build stage creates a container that handles the installation of dependencies and any build tasks.
In our example, the first container executes the `npm install` command. `node_modules` may
contain native add-ons, which means the first container needs the relevant compilers and dependencies.

The second container uses a base of the `node:22-slim` image. The `node:22-slim` image is
a variant of the official Node.js Docker image that contains the minimum libraries required to run
Node.js. This image is a much smaller and lighter-weight image. The regular `node` Docker image is
around 1 GB in size, whereas the multi-stage `slim` image is around 200 MB. When deploying to the
cloud, in many cases, you’ll be charged per MB. Minimizing your image size can result in cost savings.

**Important note:**
Once you’are done, you should stop and remove the Docker
containers and images. Otherwise, the containers and images may linger on your system and
consume system resources. Use `$ docker ps` to list your containers. Locate the container
identifier and pass this to `$ docker stop <containerID>` to stop a container. Follow
this up with `$ docker rm -f <containerID>` to remove a container. Similarly, to
remove a Docker image, use the `$ docker image rm <image>` command. You can
also use (with caution) the `$ docker system prune --all` command to remove all
images and containers on your system.
