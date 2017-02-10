'use strict'

let yaml = require('yamljs')

module.exports = {
    
    toDockerCompose: function(cargoConfig) {
        let dockerCompose = {
            version: '2',
            services: {},
            networks: {}
        }

        Object.assign(dockerCompose.services, this.getDatabaseService(cargoConfig))
        Object.assign(dockerCompose.services, this.getServices(cargoConfig))
        Object.assign(dockerCompose.networks, this.getNetwork(cargoConfig))

        return yaml.stringify(dockerCompose, 10, 2)
    },

    getServices: function(config) {
        let root = {}

        Object.keys(config.services).forEach(serviceName => {
            root[serviceName] = this.getService(config, serviceName, config.services[serviceName]);
        })

        return root;
    },

    getNetwork: function(config) {
        let network = {}
        network[config.network.name] = {
            driver: config.network.type,
            ipam: {
                driver: 'default',
                config: [
                    {
                        subnet: '172.16.238.0/24',
                        gateway: '172.16.238.1'
                    }
                ]
            }
        }
        return network
    },

    getService: function(config, name, service) {
        switch (service.type.toUpperCase()) {
            case 'SPRINGBOOT':
                return {
                    image: 'cargo/' + name,
                    ports: [`${service.port}:${service.port}`],
                    networks: [config.network.name],
                    environment: service.env,
                    restart: 'always',
                    depends_on: [config.database.toLowerCase() + '-0']
                }
            default:
                return {}
        }
    },

    getDatabaseService: function(config) {
        if (config.database.toUpperCase() === 'CASSANDRA') {
            return {
                'cassandra-0': {
                    image: 'cassandra:2.1.14',
                    container_name: 'cassandra-0',
                    restart: 'always',
                    ports: [
                        '9042:9042', '9160:9160', '7199:7199', '7000', '7001'
                    ],
                    networks: [config.network.name]
                }
            };
        }
    }
}
