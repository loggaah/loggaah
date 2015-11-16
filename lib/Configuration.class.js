"use strict";

var _ = require('lodash');

var Plugin = require('./Plugin.interface');
var ConfigurationElement = require('./ConfigurationElement.class');
var Appenders = require('./Appenders.class');
var Processors = require('./Processors.class');
var Loggers = require('./Loggers.class');
var Configurators = require('./Configurators.class');

class Configuration {
    constructor() {
        this._root = {};
    }

    get configurators() {
        return Configurators;
    }

    get appenders() {
        return Appenders;
    }

    get processors() {
        return Processors;
    }

    get loggers() {
        return Loggers;
    }

    get root() {
        return this._root;
    }

    get debug() {
        return !!this._debug;
    }

    set debug(enabled) {
        this._debug = !!enabled;
    }

    get() {
        return {
            configurators: this._configurators.list(),
            appenders: this._appenders.list(),
            processors: this._processors.list(),
            loggers: this._loggers.list(),
            root: this._root
        };
    }

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