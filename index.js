"use strict";

var _ = require('lodash');

var Appenders = require('./lib/Appenders.class');
var Configuration = require('./lib/Configuration.class');
var Loggers = require('./lib/Loggers.class');
var Processors = require('./lib/Processors.class');

var fileRegex = /[\w\.]+:/;

class Main {
    constructor() {
        this._loggers = {};
    }

    set debug(enabled) {
        Configuration.debug = enabled;
    }

    get debug() {
        return Configuration.debug;
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
            return Loggers.__create(name, config);
        }
        return Loggers.__get(name);
    }

    setLogger(name, config) {
        var logger = Loggers.__get(name);
        if (!logger) {
            logger = this.getLogger(name, config);
        }
        logger.config = config;
    }

    setLevel(pattern, level) {
        // TODO apply level to all loggers that match the pattern
    }

    setAppender(pattern, appender, config) {
        // TODO this should go into appenders
        // TODO check if appender exists. If not add this one to types of appenders (if is instance)
        // TODO run configuration against appender (assign processors)
        // TODO store appender under pattern
        // TODO apply to all existing loggers that match pattern
    }

    getAppender(name) {
        return Appenders.__parse(name);
        // TODO check if is instance of appender
        // TODO check if pattern matches the name of an existing appender
        // TODO check if name is pattern
    }

    setProcessor(name, processor, config) {
        // TODO check if processor exists. If not add this one to types of processors (if is instance)
        // TODO store processor under name
    }

    getProcessor(nameOrProcessor) {

    }

    setConfigurator(configurator, config) {

    }

    getConfigurator(configurator) {

    }

    get configuration() {
        return Configuration;
    }

    set configuration(config) {
        for (let property in config) {
            Configuration[property] = config[property];
        }
    }
}

module.exports = new Main();
module.exports.Appenders = Appenders;
module.exports.Configurators = require('./lib/Configurators.class');
module.exports.Level = require('./lib/Level.class');
module.exports.MDC = require('./lib/MDC.class');
module.exports.Processors = Processors;

// Plugins
require('./lib/configurators/DefaultConfigurator.class');
require('./lib/configurators/JsonConfigurator.class');
require('./lib/appenders/ConsoleAppender.class');
require('./lib/appenders/FileAppender.class');
require('./lib/appenders/MemoryAppender.class');
require('./lib/processors/Formatter.class');
require('./lib/processors/Batcher.class');