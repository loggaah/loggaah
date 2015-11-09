"use strict";

var _ = require('lodash');

var Logger = require('./lib/Logger.class');
var Level = require('./lib/Level.class');
var MDC = require('./lib/MDC.class');

var fileRegex = /[\w\.]+:/;

class Main {
    constructor() {
        this._loggers = {};
    }

    getLogger(param1, param2) {
        var name;
        if (_.isString(param1)) {
            name = param1;
        }
        if (_.isString(param2)) {
            name = param2;
        }
        if (!name || _.trim(name) == '') {
            // TODO this shoud include a relative path to the root of the project
            // (try to compare process.args to this path)
            // (try to find package.json)
            var match = fileRegex.exec(new Error().stack.substr(__filename.length + 37));
            name = _.trimRight(match[0], ':');
        }

        var config;
        if (_.isObject(param1)) {
            config = param1;
        }
        if (_.isObject(param2)) {
            config = param2;
        }
        if (!this._loggers[name]) {
            this._loggers[name] = new Logger(name);
        }
        if (config) {
            this._loggers[name].config = config;
        }
        return this._loggers[name];
    }

    setLogger(name, config) {
        if (this._loggers[name]) {
            this._loggers[name].config = config;
        }
    }
}

module.exports = new Main();
module.exports.Level = Level;
module.exports.MDC = MDC;