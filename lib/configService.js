'use strict'

let jsonfile = require('jsonfile'),
    fs = require('fs'),
    packageConfig,
    appConfig

module.exports = {

    createNewProject: function(targetLocation) {
        let filePath = `${targetLocation}/cargo-compose.json`

        if (fs.existsSync(filePath)) {
            return 'There is already an existing cargo-compose project in the current directory:\n' + filePath
        } else {
            let project = this.getDraftProject()
            fs.writeFileSync(filePath, project)
            return project
        }
    },

    getMergedConfig: function() {
        let globalConfig = this.getGlobalConfig(),
            localConfigFile = process.cwd() + `/${this.getLibName()}.json`,
            config = globalConfig

        if (fs.existsSync(localConfigFile)) {
            Object.apply(config, this.readJsonFile(localConfigFile))
        }

        return config
    },

    getPackageConfig: function() {
        if (!packageConfig) {
            packageConfig = this.readJsonFile(this.getLibFilePath('package.json'))
        }

        return packageConfig
    },

    getGlobalConfig: function() {
        if (!appConfig) {
            appConfig = this.readJsonFile(this.getLibFilePath(this.getLibName() + '.json'))
        }

        return appConfig
    },

    getDraftProject: function() {
        return {
            dockerImagePrefix: `cargo-compose-${this.randomWord()}-${this.getRandomNumber(99, 9999)}`,
            services: {},
            database: 'none',
            network: {
                type: 'bridge',
                name: 'app_net'
            }
        }
    },

    randomWord: function() {
        let words = [
            'primus',
            'ultron',
            'xenon',
            'megatron',
            'wolf',
            'tiger',
            'eagle'
        ]
        let randIndex = this.getRandomNumber(0, words.length)

        return words[randIndex]
    },

    getRandomNumber: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getLibName: function() {
        return this.getPackageConfig().name
    },

    readJsonFile: function(file) {
        return jsonfile.readFileSync(file)
    },

    getLibFilePath: function(file) {
        return require('path').dirname(require.main.filename) + '/' + file
    }
}
