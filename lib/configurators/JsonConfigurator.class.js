"use strict";

var fs = require('fs');

var Configurations = require('../Configurations.class');
var Configurator = Configurations.interface;

var defaultSettings = {
    files: [
        'loggaah-test.json', 'logger-test.json', 'logging-test.json',
        'loggaah.json', 'logger.json', 'logging.json'
    ],
    rescan: 0
};

class JsonConfigurator extends Configurator {
    constructor() {
        super();
        this._lastModified = 0;
    }

    get name() {
        return "json";
    }

    scan(currentConfig, changeCallback) {
        this._setConfiguration = changeCallback;
        this.findConfig(currentConfig.configurators.json.rootPath, currentConfig.configurators.json.files);
        this._debug = !!currentConfig.debug;
        this._rescan = parseInt(currentConfig.configurators.json.rescan);
        clearTimeout(this._timeout);
        this.read();
    }

    findConfig(path, names) {
        if (!path) {
            path = this.getRootPath();
        }
        var files = fs.readdirSync(path);
        for (let file of files) {
            var fullPath = path + "/" + file;
            let stats = fs.statSync(fullPath);
            if (stats.isFile()) {
                for (let name of names) {
                    var suffix = fullPath.lastIndexOf(name);
                    if (suffix !== -1 && suffix == fullPath.length - name.length) {
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

    getRootPath() {
        return ".";
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
            var stats = fs.statSync(this._location);
            if (this._lastModified < stats.mtime.getTime()) {
                this._lastModified = stats.mtime.getTime();
                var config = JSON.parse(fs.readFileSync(this._location, 'utf8'));
                this._setConfiguration(config);
            }
            if (this._rescan > 0) {
                this._timeout = setTimeout(this.read, this._rescan * 1000);
            }
        } catch (e) {}
    }
}

module.exports = new JsonConfigurator();
Configurations.setConfigurator(module.exports, defaultSettings);