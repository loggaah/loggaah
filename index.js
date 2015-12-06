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
     * @param {string} [param1='<filename>']   Logger name to set
     * @param {Object|Configuration} [param2]  Logger configuration to use
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
     * @param {string|RegExp} name              The name or regular expression of the logger to configure
     * @param {Object|Configuration} config     The configuration to set for this/these loggers
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
     * @param {string|RegExp} pattern
     * @param {Level} level
     */
    setLevel(pattern, level) {
        // TODO add regex rule to Loggers.class
    }

    /**
     *
     * @param {string} name
     * @param {Object|Configuration} config
     */
    setAppender(name, config) {
        if (!this.configuration.appenders[name]) {
            this.configuration.appenders.add(name, config);
        }
        this.configuration.appenders[name] = config;
    }

    /**
     *
     * @param name
     * @returns {Appender}
     */
    getAppender(name) {
        return Appenders.__parse(name);
    }

    /**
     *
     * @param {string} name
     * @param {Object|Configuration} config
     */
    setProcessor(name, config) {
        if (!this.configuration.processors[name]) {
            this.configuration.processors.add(name, config);
        }
        this.configuration.processors[name] = config;
    }

    /**
     *
     * @param name
     * @returns {Processor}
     */
    getProcessor(name) {
        return Processors.__parse(name);
    }

    /**
     *
     * @param {string} name
     * @param {Object|Configuration} config
     */
    setConfigurator(name, config) {
        if (this.configuration.configurators[name]) {
            this.configuration.configurators[name] = config;
        } else {
            throw new Error('Trying to set configuration for non existent Configurator: ' + name);
        }
    }

    /**
     *
     * @param {string} name
     * @returns {Configurator}
     */
    getConfigurator(name) {
        return Configurators.__parse(name);
    }

    /**
     *
     * @returns {Object|Configuration}
     */
    get configuration() {
        return Configuration;
    }

    /**
     *
     * @param {Object|Configuration} config
     */
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