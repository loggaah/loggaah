"use strict";

var Plugin = require('./Plugin.interface.js');
var ConfigurationElement = require('./ConfigurationElement.class');

class Appender extends Plugin {
    set configuration(configuration) {
        throw new Error("Not implemented!");
    }

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
        this.__instances[name].update(configuration);
    }
}

module.exports = new Appenders();
module.exports.interface = Appender;