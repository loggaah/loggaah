"use strict";

var _ = require('lodash');

var Appenders = require('./lib/Appenders.class');
var Configurations = require('./lib/Configurations.class');
var Level = require('./lib/Level.class');
var Logger = require('./lib/Logger.class');
var MDC = require('./lib/MDC.class');
var Processors = require('./lib/Processors.class');

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
        // TODO Check for patterns in appenders that match this logger and apply
        // TODO Check for patterns in levels that match this logger and apply
        // TODO combine these two lookups into one
        return this._loggers[name];
    }

    setLogger(name, config) {
        if (this._loggers[name]) {
            this._loggers[name].config = config;
        }
    }

    setAppender(pattern, appender) {
        // Maybe this should go into appenders
        // TODO store pattern
        // TODO apply to all existing loggers that match pattern
    }

    getAppender(appender) {

    }

    setLevel(pattern, level) {
        // TODO apply level to all loggers that match the pattern
    }
}

module.exports = new Main();
module.exports.Appenders = Appenders;
module.exports.Configurations = Configurations;
module.exports.Level = Level;
module.exports.MDC = MDC;
module.exports.Processors = Processors;