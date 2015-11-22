"use strict";

var _ = require('lodash');

var Plugin = require('./Plugin.interface.js');
var ConfigurationElement = require('./ConfigurationElement.class');

class Appender extends Plugin {
    set configuration(configuration) {
        this._processors = [];
        for (let processor in configuration.processors) {
            this._processors.push[processor];
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
     * @param message
     */
    process(message) {
        var processors = _.clone(this._processors);
        var first = processors.shift();
        Configuration.processors[first].__proceed(message, processors, this.name);
    }

    /**
     * Called by the processor after it was processed.
     * @param message
     */
    append(message) {
        throw new Error("Not implemented!");
    }
}

class Appenders extends ConfigurationElement {
    constructor() {
        super();
        this.__instances = {};
    }

    __update(name, configuration) {
        if (!this.__instances[name]) {
            this.__instances[name] = this.__registry.get(configuration.type);
        }
        this.__instances[name].configuration = configuration;
    }
}

module.exports = new Appenders();
module.exports.interface = Appender;