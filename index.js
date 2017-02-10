'use strict'

let columnify = require('columnify'),
	program = require('commander'),
	colors = require('colors')

let ConfigService = require('./lib/configService'),
	PreRequisites = require('./lib/pre-requisites'),
	Composer = require('./lib/composer'),
	server = require('./ui/server'),
	packageConfig = ConfigService.getPackageConfig(),
	config = ConfigService.getMergedConfig()


// program
program.version(packageConfig.version);

program
	.command('generate')
	.description('Generates the Docker-compose.yml out of the current directories\' "cargo-compose.json" file and prints it to stdout')
	.action(() => console.log(Composer.toDockerCompose(config)))

program
	.command('ui')
	.description('Starts the cargo-compose UI in this process')
	.action(() => server.start(config.serverPort, false))

// start
program.parse(process.argv);
