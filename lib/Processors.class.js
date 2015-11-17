"use strict";

var Plugin = require('./Plugin.interface.js');
var ConfigurationElement = require('./ConfigurationElement.class');

class Processor extends Plugin {
    set configuration(configuration) {
        throw new Error("Not implemented!");
    }

    process(message) {
        throw new Error("Not implemented!");
    }
}

class Processors extends ConfigurationElement {
    constructor() {
        super();
        this.__instances = {};
    }

    __update(name, configuration) {
        if (!this.__instances[name]) {
            this.__instances[name] = this.__registry.get(configuration.type);
        }
        this.__instances[name].update(configuration);
    }
}

module.exports = new Processors();
module.exports.interface = Processor;