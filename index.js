"use strict";

var _ = require('lodash');

var Appenders = require('./lib/Appenders.class');
var Configuration = require('./lib/Configuration.class');
var Configurators = require('./lib/Configurators.class');
var Loggers = require('./lib/Loggers.class');
var Processors = require('./lib/Processors.class');

var fileRegex = /[\w\.]+:/;

/**
 * Entry point for external systems that want to use this library.
 */
class Main {
    constructor() {
        this._loggers = {};
    }

    /**
     * Enable debug logs printed to the console.
     * @param {boolean} enabled
     */
    set debug(enabled) {
        Configuration.debug = enabled;
    }

    /**
     * Returns true if debug logs are printed to the console.
     * @returns {boolean}
     */
    get debug() {
        return Configuration.debug;
    }

    /**
     * Returns a logger instance that is used to log messages. Both parameters are optional and the order is
     * interchangeable. If no name is given a name will be automatically determined depending on the file location
     * from which the logger was called. If no configuration is given, the default or previously defined configuration
     * is in effect.
     * @param {String} param1           Logger name to set
     * @param {Object|Configuration} param2    Logger configuration to use
     * @returns {Logger}
     */
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

    /**
     * Set the configuration for a logger.
     * @param {String|Regex} name      The name or regular expression of the logger to configure
     * @param {Object|Configuration} config    The configuration to set for this/these loggers
     */
    setLogger(name, config) {
        // TODO deal with regex name
        // TODO this needs to go into Loggers
        var logger = Loggers.__get(name);
        if (!logger) {
            logger = this.getLogger(name, config);
        }
        logger.config = config;
    }

    /**
     * Shorthandmethod for setting the level configuration for a logger.
     * @param pattern
     * @param level
     */
    setLevel(pattern, level) {
        // TODO add regex rule to Loggers.class
    }

    setAppender(appender, config) {
        if (!this.configuration.appenders[appender]) {
            this.configuration.appenders.add(appender, config);
        }
        this.configuration.appenders[appender] = config;
    }

    getAppender(appender) {
        return Appenders.__parse(appender);
    }

    setProcessor(processor, config) {
        if (!this.configuration.processors[processor]) {
            this.configuration.processors.add(processor, config);
        }
        this.configuration.processors[processor] = config;
    }

    getProcessor(processor) {
        return Processors.__parse(processor);
    }

    setConfigurator(configurator, config) {
        if (this.configuration.configurators[configurator]) {
            this.configuration.configurators[configurator] = config;
        } else {
            throw new Error('Trying to set configuration for non existent Configurator: ' + configurator);
        }
    }

    getConfigurator(configurator) {
        return Configurators.__parse(configurator);
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
module.exports.Configurators = Configurators;
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