"use strict";

var _ = require('lodash');

var Appenders = require('./Appenders.class');
var Processors = require('./Processors.class');
var Loggers = require('./Loggers.class');
var Configurators = require('./Configurators.class');

/**
 * A wrapper class to give access to the individual subsystems with having to do function calls. This mimics behavior
 * of a simple object that listens to changes.
 */
class Configuration {
    /**
     *
     */
    constructor() {
        this._root = {};
    }

    /**
     *
     * @returns {Configurators}
     */
    get configurators() {
        return Configurators;
    }

    /**
     *
     * @returns {Appenders}
     */
    get appenders() {
        return Appenders;
    }

    /**
     *
     * @returns {Processors}
     */
    get processors() {
        return Processors;
    }

    /**
     *
     * @returns {Loggers}
     */
    get loggers() {
        return Loggers;
    }

    /**
     *
     * @returns {Logger}
     */
    get root() {
        return this._root;
    }

    /**
     *
     * @returns {boolean}
     */
    get debug() {
        return !!this._debug;
    }

    /**
     *
     * @param {boolean} enabled
     */
    set debug(enabled) {
        this._debug = !!enabled;
    }

    /**
     *
     * @returns {Configuration}
     */
    get() {
        return {
            configurators: this._configurators.list(),
            appenders: this._appenders.list(),
            processors: this._processors.list(),
            loggers: this._loggers.list(),
            root: this._root
        };
    }

    /**
     *
     * @param {Object|Configuration} configuration
     */
    set(configuration) {
        if (_.isObject(configuration)) {
            this.debug = configuration.debug;
            for (let configurator in configuration.configurators) {
                Configurators[configurator] = configuration.configurators[configurator];
            }
            for (let appender in configuration.appenders) {
                Appenders[appender] = configuration.appenders[appender];
            }
            for (let processor in configuration.processors) {
                Processors[processor] = configuration.processors[processor];
            }
            for (let logger in configuration.loggers) {
                Loggers[logger] = configuration.loggers[logger];
            }
            // TODO deal with root
        }
    }
}

module.exports = new Configuration();