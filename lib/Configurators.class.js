"use strict";

var Plugin = require('./Plugin.interface.js');
var ConfigurationElement = require('./ConfigurationElement.class');

/**
 * Parent class for all appender implementation. If you want your appender to work with this logging system, you have
 * to implement the scan method.
 * @abstract
 * @implements Plugin
 */
class Configurator extends Plugin {
    /**
     * A configuration will be triggered through this method.
     *
     * @param currentConfiguration object   the configuration as known by the Configurations singleton.
     */
    scan(currentConfiguration) {
        throw new Error("Not implemented!");
    }

    /**
     *
     */
    destroy() {}
}

/**
 * Class managing configuration and instances of Configurators.
 * @extends ConfigurationElement
 */
class Configurators extends ConfigurationElement {
    constructor() {
        super();
        this.__instances = {};
    }

    /**
     *
     * @param {String} name
     * @param {Object|Configuration} configuration
     * @private
     */
    __update(name, configuration) {
        if (!this.__instances[name]) {
            this.__instances[name] = this.__registry.get(name);
        }
        this.__instances[name].scan(configuration);
    }

    /**
     *
     * @param {*} value
     * @returns {Configurator}
     * @private
     */
    __parse(value) {
        if (value instanceof Configurator) {
            return value;
        }
        return this.__instances[value];
    }
}

module.exports = new Configurators();
module.exports.interface = Configurator;