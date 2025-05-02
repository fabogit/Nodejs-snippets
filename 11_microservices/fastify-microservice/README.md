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

## Publishing a Docker image

First create a Docker Hub account. Visit <https://hub.docker.com/signup>
to create an account.

Once you’ve created your Docker Hub account, you need to authenticate your Docker client.
Do this by entering the following command in your terminal:
`$ docker login`

Once we have authenticated our Docker client, we then need to retag our image for it to be
pushed to Docker Hub. Tag the image with the following command, substituting `<namespace>`
with your Docker Hub ID:
`$ docker tag fastify-microservice <namespace>/fastify-microservice`

Now, we need to push the newly tagged image using the `docker push` command:

```Bash
$ docker push <namespace>/fastify-microservice
Using default tag: latest
The push refers to repository [docker.io/<namespace>/fastify-microservice]
2e4fc733214e: Preparing
f4ab51cf75a4: Preparing
92f894697ee2: Preparing
69619ce237eb: Preparing
3e23088f380e: Preparing
...
```

You can now navigate to <https://hub.docker.com/repository/docker/><namespace>/fastify-microservice
to verify that your image has been published to Docker Hub. Again, you’ll need to substitute `<namespace>` with your
Docker Hub ID.

If you click on **Tags**, you should see that our Docker image has one tag named latest.

It is also now possible to pull the image with the following command:
`$ docker pull <namespace>/fastify-microservice`

We’ve pushed a Docker image containing our `fastify-microservice` image to Docker Hub!

We first tagged the `fastify-microservice` image with the `<namespace>/fastify-microservice`
tag. This tag format instructs Docker that this image is associated with a repository
on Docker Hub. Once we’ve appropriately tagged our image, we use the `docker push` command
to publish the image to Docker Hub.

By default, our Docker Hub image will be publicly accessible. Production microservices are not typically
expected to be published publicly to Docker Hub to avoid exposing any proprietary code or secrets.
Docker Hub does provide private image functionality, but users are limited to one private registry on
Docker Hub’s free account plan. It is possible to sign up for a paid account plan with Docker Hub,
which provides unlimited private repositories.

When deploying images for use in production-grade systems, it is common to create a private Docker
registry. Docker exposes a registry image (<https://hub.docker.com/_/registry>) that can
be used to provision a private registry. For more information on setting up a private registry, refer
to <https://docs.docker.com/registry/deploying/>.

The `<IP>:<PORT>/<IMAGE>` format is used when referring to images stored in private registries,
where the IP is the address of the private registry. Many of the leading cloud providers also provide
commercial container registry solutions, which can be used to avoid the overhead of managing a
container registry.

### There’s more…

Here we did not specify a version tag for our Docker image. Therefore, Docker defaulted to
creating the `latest` version tag for our image. The `latest` tag is automatically updated each time
we rebuild our image without explicitly specifying a version tag.

It is generally considered good practice to version Docker Hub images similar to how you’d version
an application. Versioning Docker Hub images provides a history of images, which makes it possible
to roll back to earlier image versions should something go wrong.

We can tag our `fastify-microservice` image with the following command, substituting the
namespace for our Docker Hub username:
`$ docker tag fastify-microservice <namespace>/fastify-microservice:1.0.0`

The `1.0.0` version is specified in the preceding command to match the version declared in our
`package.json` file. This is just one of many approaches we can take to versioning as there is no
formal standard for how Docker images should be versioned. Other options include an incremental
versioning scheme or even using the Git commit SHA of the application code as the version tag.

We push the image to Docker Hub with the following command:
`$ docker push <namespace>/fastify-microservice:1.0.0`

If we navigate to the **Tags** panel for our `fastify-microservice` image on Docker Hub, we
should be able to see that our newly pushed image version is available.

## Deploying to Kubernetes

Kubernetes is an open source container orchestration and management system originally
developed by Google. Today, the Kubernetes project is maintained by the Cloud Native Computing
Foundation (<https://www.cncf.io/>).

Kubernetes is a comprehensive and complex tool that provides the following features, among others:

- Service discovery and load balancing

- Storage orchestration

- Automated rollouts and rollbacks

- Automatic bin packing, specifying how much CPU and memory each container needs

- Self-healing

- Secret and configuration management

An oversimplified description of Kubernetes is that it is a tool used to manage containers.

This will serve as an introduction to Kubernetes, demonstrating how we can deploy a microservice,
packaged into a Docker container, to Kubernetes.

On Linux, an alternative is to use **minikube**, which is
a tool that runs a Kubernetes cluster in a virtual machine on your local device. Minikube has a
more complicated setup compared to Docker for Desktop. First, you’ll need to manually install
the `kubectl` CLI (<https://kubernetes.io/docs/tasks/tools/install-kubectl/>),
and then follow the installation instructions for Minikube at <https://kubernetes.io/docs/tasks/tools/install-minikube>.

Open a new terminal window and verify that both Docker and the kubectl CLI are present
by entering the following commands. Expect to see output similar to the following:

```Bash
docker --version
Docker version 28.1.1, build 4eba377327
```

```Bash
kubectl version
Client Version: v1.32.4
Kustomize Version: v5.5.0
Server Version: v1.32.0
```

### How to do it…

We’re going to deploy our `fastify-microservice` image to Kubernetes. We’ll be
using the `kubectl` CLI to interact with our Kubernetes cluster:

1.  First, let’s test out some `kubectl` commands. Enter the following commands to list the
    Kubernetes nodes and services present on our cluster:

    ```Bash
    $ kubectl get nodes
    NAME       STATUS   ROLES           AGE     VERSION
    minikube   Ready    control-plane   3m30s   v1.32.0
    ```

    ```Bash
    $ kubectl get services
    NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
    kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   4m23s
    ```

2.  Now, we can proceed to deploy our `fastify-microservice` image. Let’s start by ensuring
    we have our Docker image built. To do so, run the following command within the `fastify-microservice` directory:
    `$ docker build --tag fastify-microservice .`

3.  Next, we’ll create our deployment files. The deployment files will be a set of YAML files that
    are used to configure Kubernetes. We’ll create a subdirectory named `deployment` to hold
    the deployment files:
    ```Bash
    $ mkdir deployment
    $ touch deployment/fastify-app.yml deployment/fastify-app-svc.yml
    ```
4.  We’re going to create a Kubernetes deployment. We can configure a Kubernetes deployment
    with a YAML file. To create a deployment YAML file, add the following to `deployment/fastify-app.yml`:

```Yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fastify-app
  labels:
    app: fastify
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fastify
  template:
    metadata:
      labels:
        app: fastify
    spec:
      containers:
        - name: fastify-app
          image: fastify-microservice:latest
          imagePullPolicy: Never
          ports:
            - containerPort: 3000

```

To create the Kubernetes deployment, we need to apply our YAML file that describes the
deployment. We can confirm that the deployment has been created by asking our Kubernetes
cluster to list its deployments. Do this by entering the following two commands:

```Bash
$ kubectl apply --filename deployment/fastify-app.yml
deployment.apps/fastify-app created
```

```Bash
$ kubectl get deployments
NAME          READY   UP-TO-DATE   AVAILABLE   AGE
fastify-app   0/3     3            0           34s
```

In our YAML file, we instructed Kubernetes to create three replicas. This means three Kubernetes
pods will be created. A Kubernetes pod is a group of one or more containers that are deployed
together on the same host and share the same network namespace and storage volumes.

We can confirm that these have been created by listing all of the pods in our Kubernetes cluster
by means of the following command:

```Bash
$ kubectl get pods
NAME                           READY   STATUS    RESTARTS   AGE
fastify-app-749687fd5f-2vxcb   1/1     Running   0          6s
fastify-app-749687fd5f-94rlc   1/1     Running   0          6s
fastify-app-749687fd5f-rvx6n   1/1     Running   0          6s
```

Now, let’s move on to how we can expose the instances of our `fastify-microservice`
image running in the pods. We do this by creating a Kubernetes Service. Add the following to
`fastify-app-svc.yml` to create the Kubernetes Service:

```Yaml
apiVersion: v1
kind: Service
metadata:
  name: fastify-app-svc
  labels:
    run: fastify
spec:
  selector:
    app: fastify
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
```

To create the Kubernetes Service defined in the previous step, we need to apply the Service YAML
file with the following commands. We can confirm that the Kubernetes Service was created by
supplying the `kubectl get service` command. Enter the following in your terminal:

```Bash
$ kubectl apply --filename deployment/fastify-app-svc.yml
service/fastify-app-svc created
```

```Bash
$ kubectl get service
NAME              TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
fastify-app-svc   NodePort    10.110.131.105   <none>        3000:32272/TCP   78s
kubernetes        ClusterIP   10.96.0.1        <none>        443/TCP          7h29m
```

Now that we have created a Kubernetes Service, we should be able to access the application in our
browser. You will need to access the application via the external port, which is the port number detailed
in the output of the previous step. In the preceding example, the application is located at
<https://localhost:32272/example>, but you will need to substitute the port, as it is randomly assigned
by Kubernetes. The external port, by default, will be in the range of `30000` to `32767` as this is the
default range assigned to **NodePort services** by Kubernetes.

We’ve now pushed our containerized fastify-microservice image to our local Kubernetes cluster.

### How it works…

Here we deployed our `fastify-microservice` image to the local Kubernetes cluster.
Many of the leading cloud providers have commercial Kubernetes offerings
that can be used should you not wish to manage a Kubernetes cluster. These commercial offerings extend
the Kubernetes open source project, meaning the underlying Kubernetes technology remains consistent
across cloud providers. Most of the providers offer CLIs to interact with their Kubernetes offering;
however, the APIs provided by these CLIs tend to just be wrappers or shortcuts for `kubectl` commands.

The following is a selection of the commercial Kubernetes Services available from leading cloud providers:

- Amazon Elastic Kubernetes Service: <https://aws.amazon.com/eks/>

- Azure Kubernetes Service: <https://azure.microsoft.com/en-gb/services/kubernetes-service/>

- Google Kubernetes Engine: <https://cloud.google.com/kubernetes-engine>

- IBM Cloud Kubernetes Service: <https://www.ibm.com/products/kubernetes-service>

Here we relied on our fastify-microservice image being built and available on the
local machine.

We declared a Kubernetes deployment in the `deployment/fastify-app.yml` file. A Kubernetes
deployment is a resource object in Kubernetes. A Kubernetes deployment allows you to define the life
cycle of your application. The life cycle definition includes the following:

- The image to use for the deployment is included. In this case, the deployment YAML referenced
  the local `fastify-microservice` image. Note that we could have supplied an external image, such as one from
  Docker Hub, or referenced an image in a private registry.

- The number of replicas or pods that should be available are included.

- How the replicas or pods should be updated is detailed.

In `deployment/fastify-app.yml`, we declared that there should be three replicas, and
therefore three pods were created by Kubernetes. We set three replicas so that if one pod crashes, then
the other two pods can handle the load. The number of replicas required will depend on the typical
load of a given application. Having multiple instances available is part of what provides Kubernetes’
“high-availability” behaviors; having other pods available that can handle the load in the case where
one pod crashes can reduce downtime. If we were to manually kill a pod with
`docker delete pod <podname>`, Kubernetes would automatically try to restart and spin up a new pod in its place.
This demonstrates Kubernetes’ “auto-restart” behavior.

To access our application, we needed to define a Kubernetes Service. This Service is used to expose
an application running on a set of pods. In the case of the recipe, we created a Kubernetes Service to
expose `fastify-microservice`, which was running in three pods. Kubernetes creates a single
DNS name for a group of Kubernetes pods, enabling load balancing between them.

For more detailed information on Kubernetes, you can refer to the following guides:

- Kubernetes overview: <https://kubernetes.io/docs/tutorials/kubernetes-basics/​>

- Kubernetes setup guide: <https://kubernetes.io/docs/setup/>

#### There’s more…

Kubernetes is focused on enabling the high availability of applications to minimize downtime. When
deploying an updated version of your microservice, Kubernetes will conduct a rolling update. Rolling
updates aim for zero downtime by incrementally updating individual pod instances with the new
version of the microservice.

We can demonstrate Kubernetes rolling updates by updating our microservice and instructing
Kubernetes to deploy the updated version of the microservice:

1. We can start by making a small change to `fastify-microservice`. Open
   `routes/example/index.js` and change the response that is returned on line `5` to the following:

   ```JavaScript
       return 'this is an updated example'
   ```

2. Now we need to rebuild our container for our microservice. We’ll tag this image with version
   `2.0.0`. Enter the following command to rebuild and tag the image:

   ```Bash
   $ docker build --tag fastify-microservice:2.0.0 .
   ```

3. Now we need to update our Kubernetes deployment. Open `deployment/fastify-app.yml`
   and change the image to reference our new image tag:

   ```Yaml
           image: fastify-microservice:2.0.0
   ```

4. Now we need to reapply our Kubernetes deployment configuration with the following command:

   ```Bash
   $ kubectl apply --filename deployment/fastify-app.yml
   deployment.apps/fastify-app configured
   ```

5. Enter the following to obtain the `NodePort` for our Kubernetes Service. We need this port
   to access the application from our browser:

   ```Bash
   $ kubectl describe service fastify-app-svc | grep NodePort:
   NodePort:                 <unset>  31815/TCP
   ```

6. Navigate to <http://localhost:<NodePort>/example>, where `NodePort` is the
   port output from the previous command.

The **this is an updated example** string should be returned in your browser, indicating that the rolling
update has taken place.

**Important note:**
Once you’are done, including the There’s more… section, you should delete the
Kubernetes resources you have created to avoid an unnecessary load on your system. To delete
the deployment, use the `$ kubectl delete deployment fastify-app` command.
Similarly, to delete the Kubernetes Service, use the `$ kubectl delete service fastify-app-svc` command.
