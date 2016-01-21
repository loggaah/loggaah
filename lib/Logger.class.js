'use strict';

var _ = require('lodash');

var Core = require('./Core.class');
var Event = require('./Event.class');
var Level = require('./Level.class');
var MDC = require('./MDC.class');


var fileRegex = /[\w\.]+:/;

/**
 * The Logger class, the developers entry point into the logging system.
 */
class Logger {
    /**
     *
     * @param {string} [name]
     * @param {Object} [config]
     * @property {Level|string|number} level
     */
    constructor(name, config) {
        if (_.isObject(name)) {
            config = name;
            name = null;
        }
        if (!name) {
            var match = fileRegex.exec(new Error().stack.substr(__filename.length + 37));
            name = _.trimEnd(match[0], ':');
        }
        this._name = name;
        this._process = process.pid;
        this._buffer = [];
        this.level = Level.default;
        if (config) {
            this.config = config;
        }
        Core.registerLogger(this);
    }

    /**
     * Adds and/or configures an appender to be used by this logger.
     * @param {string} name
     * @param {Object} config
     * @returns {Appender}
     */
    setAppender(name, config) {
        var appender = Core.configureAppender(name, config);
        var loggerConfig = Core.getLoggerConfig(this.name);
        if (!loggerConfig.appenders) {
            loggerConfig.appenders = [];
        }
        if (loggerConfig.appenders.indexOf(name) == -1) {
            loggerConfig.appenders.push(name);
        }
        Core.configureLogger(this.name, loggerConfig);
        return appender;
    }

    /**
     * Removes an appender for this specific logger.
     * @param {string} name
     */
    removeAppender(name) {
        var config = Core.getLoggerConfig(this.name);
        if (config && _.isArray(config.appenders)) {
            Core.configureLogger(this.name, _.filter(config.appenders, entry => entry == name));
        } else {
            Core.configureLogger(this.name, {});
        }
    }

    /**
     * Returns a list of all appenders this logger has assigned to it.
     * @returns {*}
     */
    listAppenders() {
        var config = Core.getLoggerConfig(this.name);
        if (config && _.isArray(config.appenders)) {
            return config.appenders;
        }
        return [];
    }

    /**
     * Sets the configuration of this logger. The configuration is an object holding all config properties for this
     * logger that can also be set individually.
     * @param {Object} config
     * @property {Level|string|number} level
     */
    set config(config) {
        if (config.level) {
            this.level = Level.parse(config.level);
        }
    }

    /**
     * Returns the current configuration of this logger.
     * @returns {Object}
     * @property {Level|string|number} level
     */
    get config() {
        return {
            level: this._level
        }
    }

    /**
     * Sets the logging level of this logger. Any messages below the set level will be ignored.
     * @param {Level} level
     */
    set level(level) {
        if (level) {
            this._level = Level.parse(level);
        }
    }

    /**
     * Returns the level this Logger is set to. Any messages below this level will be ignored.
     * @returns {Level}
     */
    get level() {
        return this._level;
    }

    /**
     * Returns the process id from which this logger was created.
     * @returns {number}
     */
    get process() {
        return this._process;
    }

    /**
     * Returns whether the logger is enabled for a given Level.
     * @example
     * // returns true | false;
     * log.enabled('info');
     * @param {Level|string|number} level
     * @returns {boolean}
     */
    enabled(level) {
        return Level.parse(level) >= this._level;
    }

    /**
     * Returns the name of this logger.
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Logs a message with the given parameters. Accepts a formatter pattern, parameters, mdc and exceptions as
     * arguments (in any order). Only restriction is that the first string to be found is used as the pattern.
     */
    log() {
        var level, pattern, error, mdc, params = [];
        for (let arg of arguments) {
            if (arg instanceof Level.constructor) {
                level = arg;
                if (!this.enabled(level)) {
                    return;
                }
            }
            else if (arg instanceof Error) {
                error = arg;
            }
            else if (arg instanceof MDC) {
                mdc = arg;
            }
            else if (_.isString(arg) && !pattern) {
                pattern = arg;
            }
            else {
                params.push(arg);
            }
        }

        Core.queueEvent(new Event(this._name, level, pattern, mdc, error, params))
    }
}

module.exports = Logger;
