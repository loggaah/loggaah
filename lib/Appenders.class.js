"use strict";

var _ = require('lodash');

var Plugin = require('./Plugin.interface.js');
var ConfigurationElement = require('./ConfigurationElement.class');
var Loggers = require('./Loggers.class');

class Appender extends Plugin {
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

    addProcessor(name) {
        this._processors.push(name);
    }

    removeProcessor(name) {
        _.pull(this._processors, name);
    }

    clearProcessors() {
        this._processors = [];
    }

    /**
     * // TODO move this logic into the logger where all logic is combined
     * Called by the logger to first do processing.
     * @param event
     */
    process(event) {
        if (this._processors.length) {
            var processors = _.clone(this._processors);
            var first = processors.shift();
            require('./Configuration.class').processors.__instances[first].__proceed(event, processors, this.name);
        } else {
            this.append(event);
        }
    }

    /**
     * Called by the processor after it was processed.
     * @param {Event[]|Event} messages
     */
    append(messages) {
        throw new Error("Not implemented!");
    }

    destroy() {}
}

class Appenders extends ConfigurationElement {
    constructor() {
        super();
        this.__instances = {};
    }

    __update(name, configuration) {
        if (!this.__instances[name]) {
            this.__instances[name] = this.__registry.get(configuration.type);
            this.__instances[name].name = name;
        }
        this.__instances[name].configuration = configuration;
        Loggers.__updateAppender(name);
    }

    __parse(value) {
        if (value instanceof Appender) {
            return value;
        }
        return this.__instances[value];
    }
}

module.exports = new Appenders();
module.exports.interface = Appender;