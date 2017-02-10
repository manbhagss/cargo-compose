'use strict'

let jsonfile = require('jsonfile'),
    fs = require('fs'),
    packageConfig,
    appConfig

module.exports = {

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
