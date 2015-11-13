"use strict";

var fs = require('fs');

var Configurations = require('../Configurations.class');
var Configurator = Configurations.interface;

var defaultFiles = [
    'loggaah-test.json', 'logger-test.json', 'logging-test.json',
    'loggaah.json', 'logger.json', 'logging.json'
];

class JsonConfigurator extends Configurator {
    constructor() {
        super();
        this._getRootPath = () => {
            // TODO figure out root path of project
        };
        this._debug = false;
        this.findConfig(this._getRootPath(), defaultFiles);
        this.read();
    }

    set ownConfiguration(configuration) {
        var rootPath = configuration.rootPath ? configuration.rootPath : this._getRootPath();
        if (configuration.rootPath || configuration.files) {
            var files = configuration.files ? configuration.files : defaultFiles;
            this.findConfig(rootPath, files)
        }
        this._debug = !!configuration.debug;
        clearTimeout(this._timeout);
        this.read();
    }

    findConfig(path, names) {
        var files = fs.readdirSync(path);
        for (let file of files) {
            var fullPath = path + "/" + file;
            let stats = fs.statSync(fullPath);
            if (stats.isFile()) {
                for (let name of names) {
                    if (file == name) {
                        this._location = fullPath;
                        return;
                    }
                }
            }
            if (stats.isDirectory() && file != "node_modules") {
                this.findConfig(fullPath, names);
            }
        }
    }

    read() {
        if (!this._location) {
            if (this._debug) {
                console.warn("No configuration file has been found for any of the given file patterns");
            }
            return;
        }
        try {
            fs.accessSync(this._location, fs.R_OK);
            // TODO check if file has changed since last scan
            var config = require(location);
            Configurations.configuration = (config);
            var timeout = 0;
            if (config.configurators
                && config.configurators.JsonConfigurator
                && config.configurators.JsonConfigurator.rescan) {
                timeout = parseInt(config.configurators.JsonConfigurator.rescan);
            }
            if (timeout > 0) {
                this._timeout = setTimeout(this.read, timeout * 1000);
            }
        } catch (e) {}
    }
}

module.exports = JsonConfigurator;
Configurations.add(JsonConfigurator);