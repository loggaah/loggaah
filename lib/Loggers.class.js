"use strict";

var ConfigurationElement = require('./ConfigurationElement.class');

class Loggers extends ConfigurationElement {
    constructor() {
        super();
        this.__rules = {};
        this.__instances = {};
    }

    __update(name, configuration) {
        // TODO handle name being a regex
        // -> add to rules, apply to all existing instances
        if (!this.__instances[name]) {
            this.__instances[name] = this.__registry.get(configuration.type);
        }
        this.__instances[name].configuration = configuration;
    }
}

module.exports = new Loggers();