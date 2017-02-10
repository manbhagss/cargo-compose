'use strict'

let columnify = require('columnify'),
	program = require('commander'),
	colors = require('colors')

let ConfigService = require('./lib/configService'),
	PreRequisites = require('./lib/pre-requisites'),
	Composer = require('./lib/composer'),
	DockerService = require('./lib/dockerService'),
	ServiceManager = require('./lib/ServiceManager'),
	server = require('./ui/server'),

	packageConfig = ConfigService.getPackageConfig(),
	config = ConfigService.getMergedConfig(),
	serviceManager = new ServiceManager(config),
	dockerService = new DockerService(config, serviceManager)


// program
program.version(packageConfig.version);

program
	.command('generate')
	.description('Generates the Docker-compose.yml out of the current directories\' "cargo-compose.json" file and prints it to stdout')
	.action(() => console.log(Composer.toDockerCompose(config)))

program
	.command('build [serviceName]')
	.description('Build the service or all, if non mentioned')
	.action((serviceName) => dockerService.build(serviceName))

program
	.command('start [subCmd]')
	.description('Start the currently generated docker-compose, rebuilding is optional')
	.action((subCmd) => {
		if (subCmd) {
			dockerService.buildAndDockerize()
		}
		dockerService.startDockerCompose()
	})

program
	.command('dockerize [serviceName]')
	.description('Dockerizes the services\' last build artifact or all, if non mentioned')
	.action((serviceName) => dockerService.dockerize(serviceName))

program
	.command('bd [serviceName]')
	.description('Builds and dockerizes a service or all, if non mentioned')
	.action((serviceName) => dockerService.buildAndDockerize(serviceName))

program
	.command('exchange [serviceName]')
	.description('Kills the old instance of the service and starts the last build container')
	.action((serviceName) => dockerService.exchange(serviceName))

program
	.command('refresh [serviceName]')
	.description('Combines building, dockerizing and exchanging the service')
	.action((serviceName) => dockerService.refresh(serviceName))

program
	.command('ui')
	.description('Starts the cargo-compose UI in this process')
	.action(() => server.start(config.serverPort, false))

// start
program.parse(process.argv);
