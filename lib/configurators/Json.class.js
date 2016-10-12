'use strict';

var fs = require('fs');

var _ = require('lodash');

var Plugins = require('../Plugins.class');

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
class Json extends Plugins.interfaces.Configurator {
    /**
     *
     */
    constructor() {
        super();
        this._lastModified = 0;
        this._configuration = defaultSettings;
    }

    /**
     * @inheritDoc
     */
    scan(globalConfig, next) {
        var config = {};
        _.merge(config, defaultSettings, globalConfig.configurators.Json);
        if (this._configuration.files) {
            this.findConfig(this._configuration.rootPath, this._configuration.files);
        }
        this._rescan = parseInt(this._configuration.rescan);
        clearTimeout(this._timeout);
        this.read(next);
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
    read(next) {
        if (!this._location) {
            // TODO only log this if debug is enabled (... somewhere)
            console.warn("No configuration file has been found for any of the given file patterns");
            return;
        }
        try {
            fs.accessSync(this._location, fs.R_OK);
            var stats = fs.statSync(this._location);
            if (this._lastModified < stats.mtime.getTime()) {
                this._lastModified = stats.mtime.getTime();
                var config = JSON.parse(fs.readFileSync(this._location, 'utf8'));
                next(config);
            }
            if (this._rescan > 0) {
                // TODO rather do this with a file watch than a timeout
                this._timeout = setTimeout(this.read, this._rescan * 1000);
            }
        } catch (e) {}
    }
}

Plugins.register(Json);
module.exports = Json;
