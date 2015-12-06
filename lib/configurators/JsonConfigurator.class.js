"use strict";

var fs = require('fs');

var loggaah = require('../../');
var Configuration = loggaah.configuration;
var Configurator = loggaah.Configurators.interface;

var defaultSettings = {
    files: [
        'loggaah-test.json', 'logger-test.json', 'logging-test.json',
        'loggaah.json', 'logger.json', 'logging.json'
    ],
    rescan: 0
};

/**
 * The most popular configuration method of all of javascript: a JSON file. This configurator reads a json file and
 * applies the settings to the logging system.
 * @extends Configurator
 */
class JsonConfigurator extends Configurator {
    /**
     *
     */
    constructor() {
        super();
        this._lastModified = 0;
    }

    /**
     * @inheritDoc
     */
    get type() {
        return "json";
    }

    /**
     * @inheritDoc
     */
    scan(pluginConfig) {
        var config = {};
        Object.assign(config, defaultSettings, pluginConfig);
        if (pluginConfig.files) {
            this.findConfig(config.rootPath, pluginConfig.files);
        }
        this._rescan = parseInt(config.rescan);
        clearTimeout(this._timeout);
        this.read();
    }

    /**
     *
     * @param {string} path
     * @param {string[]} names
     */
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

    /**
     *
     * @returns {string}
     */
    getRootPath() {
        // TODO make this smarter
        return ".";
    }

    /**
     *
     */
    read() {
        if (!this._location) {
            if (Configuration.debug) {
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
                Configuration.set(config);
            }
            if (this._rescan > 0) {
                this._timeout = setTimeout(this.read, this._rescan * 1000);
            }
        } catch (e) {}
    }
}

module.exports = JsonConfigurator;
Configuration.configurators.registry.add(module.exports);
Configuration.configurators.add('json', defaultSettings);