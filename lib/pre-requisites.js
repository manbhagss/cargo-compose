'use strict'

let commandExists = require('command-exists'),
    colors = require('colors'),
    preRequisites = ['docker', 'docker-compose'];

let service = {
    check: () => {
        preRequisites.forEach(dep => {
            commandExists(dep, (err, exists) => {
                if (!exists) {
                    console.log(`Command "${dep}" is not present! Install it before usage.`.red)
                    process.exit()
                }
            });
        })
    }
}

service.check()

module.exports = service
