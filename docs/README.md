## cargo-compose – docker-compose generator for services + control UI

cargo-compose lets you define your services and a database with minimal settings. The docker-compose file will be generated on the fly – network, linking and redundant information is abstracted away for you.

You can rebuild and exchange your services individually for an optimal local development experience and fast feedback. This is possible via the `cargo-compose` CLI or the Web-UI, that can be started from the CLI.

## Getting started

It doesn't take long to get yourself started and will hopefully save you even more time in the future. Make sure you already installed Docker and Docker-Compose.

### Setting up a project

`cargo-compose init` will generate a `cargo-compose.json` file in the current directory. You can edit it by hand to add services, a database, a network and some general configuration.

### Generate a docker-compose

`cargo-compose generate > docker-compose.yml`

### Start it

`cargo-compose start [init]` Start the current composition. If you also add `init`, all required projects will be build to Docker containers.

### Refresh a service

While developing, you may want to refresh some parts to test them. Use `cargo-compose refresh <service-name>`. It will build and dockerize the service and exchange the container in the running composition.

You can also execute building, dockerizing and exchanging seperately with `cargo-compose {build|dockerize|exchange} <service-name>`.

### Start the UI

`cargo-compose ui` will start a small NodeJS-Express-Server that provides you a UI. It helps you to manage the services within the currently running cargo.
