'use strict'

let colors = require('colors'),
    shellJs = require('shelljs/global');

module.exports = class DockerService {

    constructor(config, serviceManager) {
        this.config = config
        this.serviceManager = serviceManager
    }

    resolveService(serviceName) {
        return this.serviceManager.findService(serviceName)
    }

    buildAndDockerize(name) {
        this.build(name)
        this.dockerize(name)
    }

    // build

    build(name) {
        if (name) {
            this.buildService(this.resolveService(name))
        } else {
            this.doForAllServices(this.buildService)
        }
    }

    buildService(service) {
        let params = !config.runTests ? '-Dmaven.test.skip=true' : ''
        exec(`mvn -f ${service.location} install ${params}`)
    }

    // dockerize

    dockerize(name) {
        if (name) {
            this.dockerizeService(this.resolveService(name))
        } else {
            this.doForAllServices(this.dockerizeService)
        }
    }

    dockerizeService(service) {
        exec(`cd ${service.location}/containers/commons && sh ./dockerize-local.sh`)
    }

    exchange() {
        exec('docker-compose up -d')
    }

    refresh(name) {
        this.buildAndDockerize(name)
        this.exchange()
    }

    doForAllServices(action) {
        let all = this.serviceManager.getAll()
        Object.keys(all)
            .map(name => all[name])
            .forEach(action)
    }
}
