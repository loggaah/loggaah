"use strict";

var _ = require('lodash');

var Plugin = require('./Plugin.interface.js');
var ConfigurationElement = require('./ConfigurationElement.class');
var Loggers = require('./Loggers.class');

/**
 * Parent class for all appender implementation. If you want your appender to work with this logging system, you have
 * to implement the append method.
 * @abstract
 * @implements Plugin
 */
class Appender extends Plugin {
    /**
     *
     * @param {Object|Configuration} configuration
     */
    set configuration(configuration) {
        super.configuration = configuration;
        this._processors = [];
        if (!_.isArray(configuration.processors)) {
            configuration.processors = configuration.processors ? [configuration.processors] : [];
        }
        for (let processor of configuration.processors) {
            this._processors.push(processor);
        }
    }

    /**
     *
     * @param {string} name
     */
    addProcessor(name) {
        this._processors.push(name);
    }

    /**
     *
     * @param {string} name
     */
    removeProcessor(name) {
        _.pull(this._processors, name);
    }

    /**
     *
     */
    clearProcessors() {
        this._processors = [];
    }

    /**
     * // TODO move this logic into the logger where all logic is combined
     * Called by the logger to first do processing.
     * @param {Event|Event[]} events
     */
    process(events) {
        if (!_.isArray(events)) {
            events = [events];
        }
        if (this._processors.length) {
            var processors = _.clone(this._processors);
            var first = processors.shift();
            require('./Configuration.class').processors.__instances[first].__proceed(events, processors, this.name);
        } else {
            this.append(events);
        }
    }

    /**
     * Called by the processor after it was processed.
     * @param {Event[]|Event} messages
     */
    append(messages) {
        throw new Error("Not implemented!");
    }

    /**
     *
     */
    destroy() {}
}

/**
 * Class managing configuration and instances of Appenders.
 * @extends ConfigurationElement
 */
class Appenders extends ConfigurationElement {
    /**
     *
     */
    constructor() {
        super();
        this.__instances = {};
    }

    /**
     *
     * @param {string} name
     * @param {Object|Configuration} configuration
     * @private
     */
    __update(name, configuration) {
        if (!this.__instances[name]) {
            this.__instances[name] = this.__registry.get(configuration.type);
            this.__instances[name].name = name;
        }
        this.__instances[name].configuration = configuration;
        Loggers.__updateAppender(name);
    }

    /**
     *
     * @param {*} value
     * @returns {Appender}
     * @private
     */
    __parse(value) {
        if (value instanceof Appender) {
            return value;
        }
        return this.__instances[value];
    }
}

module.exports = new Appenders();
module.exports.interface = Appender;