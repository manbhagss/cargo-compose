'use strict'

let colors = require('colors')

module.exports = class ServiceManager {
    constructor(config) {
        this.config = config;
    }

    errorIf(condition, msg) {
        if (condition) {
            console.log(msg.red)
            process.exit()
        }
    }

    getAll() {
        return this.config.services
    }

    findService(name) {
        let service = this.config.services[name];
        this.errorIf(!service, `Service ${name} was not found in ${process.cwd()}`)
        return service;
    }
}
