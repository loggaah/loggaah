const _ = require('lodash');

const Core = require('./Core.class');
const Event = require('./Event.class');
const Level = require('./Level.class');
const MDC = require('./MDC.class');


const fileRegex = /([\w.]+):/;

/**
 * The Logger class, the developers entry point into the logging system.
 */
class Logger {
    /**
     *
     * @param {string|null} [name]
     * @param {Object|null} [config]
     * @property {Level|string|number} level
     */
    constructor(name, config) {
        this.level = Level.default;
        this._process = process.pid;
        this._buffer = [];
        if (_.isObject(name)) {
            config = name;
            name = null;
        }
        name && (this._name = name);
        config && (this.config = config);
        for (let value in Level.configuration) {
            (level => {
                this[value] = (...args) => this.log(level, ...args);
            }) (Level.parse(Level.configuration[value]));
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
        let appender = Core.configureAppender(name, config);
        let loggerConfig = Core.getLoggerConfig(this.name);
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
        let config = Core.getLoggerConfig(this.name);
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
        let config = Core.getLoggerConfig(this.name);
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
        if (!this._name) {
            let stack = new Error().stack;
            let offset = stack.indexOf('\n', Math.max(stack.lastIndexOf('loggaah/lib'), stack.lastIndexOf('loggaah/index.js')));
            this._name = fileRegex.exec(stack.substr(offset))[1];
        }
        return this._name;
    }

    /**
     * Logs a message with the given parameters. Accepts a formatter pattern, parameters, mdc and exceptions as
     * arguments (in any order). Only restriction is that the first string to be found is used as the pattern.
     * @returns {Event}
     */
    log() {
        let level, pattern, error, mdc, params = [];
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

        let event = new Event(this._name, level, pattern, mdc, error, params, this);
        Core.queueEvent(event);
        return event;
    }

    /**
     * Calling this method will terminate the program at the end of this tick.
     * You can use the same parameters as for {@link log}.
     */
    exit() {
        this.log(arguments);
        Core.exit();
    }
}

module.exports = Logger;
