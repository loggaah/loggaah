'use strict';

var _ = require('lodash');

var Plugins = require('./Plugins.class');


class Core {
    /**
     * Registers shutdown listeners that will try to process whatever remaining events are still left.
     */
    constructor() {
        this._events = [];
        this._loggers = {};
        this._rules = {};
        process.on('exit', this.exit.bind(this));
        process.on('SIGINT', this.exit.bind(this));
        process.on('SIGHUP', this.exit.bind(this));
        process.on('uncaughtException', this.exit.bind(this));
    }

    /**
     * Register an existing logger in the system so that it can receive configuration updates.
     *
     * @param {Logger} logger
     */
    registerLogger(logger) {
        if (this._loggers[logger.name]) {
            throw new Error('Trying to create logger with existing name. Only one instance can exist with the same name');
        }
        this._loggers[logger.name] = logger;
        for (let pattern in this._rules) {
            if (logger.name.match(pattern)) {
                logger.config = this._rules[pattern];
            }
        }
    }

    /**
     * Allows to set the entire configuration at once.
     *
     * @param {Object} configuration
     */
    configure(configuration) {
        for (let name in configuration.processors) {
            this.configureProcessor(name, configuration.processors[name]);
        }
        for (let name in configuration.appenders) {
            this.configureAppender(name, configuration.appenders[name]);
        }
        for (let pattern in configuration.loggers) {
            this.configureLogger(pattern, configuration.loggers[pattern]);
        }
    }

    /**
     * Configure a processor using this method.
     *
     * @param {string} name
     * @param {Object} configuration
     * @returns {Processor}
     * @throws Error when processor was not found or instance could not be created
     */
    configureProcessor(name, configuration) {
        try {
            var processor = Plugins.getInstance(name, 'processor');
            processor.configuration = configuration;
            return processor;
        } catch (e) {
            return Plugins.createInstance(configuration.type, name, configuration);
        }
    }

    /**
     *  Configure an appender using this method.
     *
     * @param {string} name
     * @param {Object} [configuration]
     * @returns {Appender}
     * @throws Error when appender was not found or instance could not be created
     */
    configureAppender(name, configuration) {
        try{
            var appender = Plugins.getInstance(name, 'appender');
            if (configuration) {
                if (configuration.type != appender.configuration.type) {
                    appender = Plugins.createInstance(configuration.type, name, configuration);
                } else {
                    appender.configuration = configuration;
                }
            }
            return appender;
        } catch(e) {
            return Plugins.createInstance(configuration.type, name, configuration);
        }
    }

    /**
     * Configure one or several loggers that match a given string or regex pattern.
     *
     * @param {String|RegExp} pattern
     * @param {Object} config
     */
    configureLogger(pattern, config) {
        this._rules[pattern] = config;
        for (let name in this._loggers) {
            if (name.match(pattern)) {
                this._loggers[name].config = config;
            }
        }
    }

    /**
     * Returns the configuration for a specific logger or an empty object.
     * @param {string} name
     * @returns {Object}
     */
    getLoggerConfig(name) {
        var config = {};
        for (let pattern in this._rules) {
            if (name.match(pattern)) {
                _.mergeWith(config, this._rules[pattern], (val1, val2) => {
                    if (_.isArray(val1)) {
                        return val1.concat(val2);
                    }
                    return [val1].concat(val2);
                });
            }
        }
        return this._rules[name] || {};
    }

    /**
     * Queues an event up for processing on next tick. If this is the first event to be added then an on tick listener
     * is registered.
     *
     * @param {Event} event
     */
    queueEvent(event) {
        if (!this._events.length) {
            process.nextTick(this.process);
        }
        this._events.push(event);
    }

    /**
     * This method is called at the end of the event loop and will process all queued up events.
     */
    process() {
        for (let event of this._events) {
            for (let pattern of this._loggers) {
                if (event.source.match(pattern)) {
                    for (let name of this._loggers[pattern].appenders) {
                        var appender = Plugins.getInstance(name, 'appender');
                        var processors = [];
                        for (let processorName of appender.configuration.processors) {
                            processors.push(Plugins.getInstance(processorName, 'processor'));
                        }
                        processors.push(appender);
                        this._processChain([event], processors);
                    }
                }
            }
        }
    }

    /**
     * Internal method to process the processor chain recursively and call the appender in the end.
     *
     * @param {Event[]} events
     * @param {Plugin[]} plugins
     * @private
     */
    _processChain(events, plugins) {
        var plugin = plugins.unshift();
        if (plugin instanceof Plugins.interfaces.Appender) {
            plugin.append(events);
        }
        if (plugin instanceof Plugins.interfaces.Processor) {
            plugin.process(events, (events) => {
                this._processChain(events, plugins);
            });
        }
    }

    /**
     * When called all messages that have been queued up are processed at the end of the tick and the program is exited
     * afterwards. Note that any plugins that delay processing of messages such as the {@link Batcher} will keep
     * messages from showing up in the logs. Anything that cannot be resolved in this tick will be lost.
     */
    exit() {
        this.process();
        process.exit();
    }
}

module.exports = new Core();
