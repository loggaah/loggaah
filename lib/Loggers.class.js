"use strict";

var Logger = require('./Logger.class');

/**
 * Class managing configuration and instances of Loggers.
 */
class Loggers {
    constructor() {
        this.__rules = {};
        this.__instances = {};
    }

    /**
     *
     * @param {string|RegExp} nameOrRegex
     * @param {Object|Configuration} configuration
     * @private
     */
    __configure(nameOrRegex, configuration) {
        this.__rules[nameOrRegex] = configuration;
        for (let name in this.__instances) {
            if (name.match(nameOrRegex)) {
                this.__instances[name].config = configuration;
            }
        }
        this.__instances[nameOrRegex].config = configuration;
    }

    /**
     *
     * @param {string} name
     * @param {Object|Configuration} [configuration]
     * @returns {Logger}
     * @private
     */
    __get(name, configuration) {
        if (!this.__instances[name]) {
            this.__instances[name] = new Logger(name);
            for (let rule in this.__rules) {
                if (name.match(rule)) {
                    this.__instances[name].config = this.__rules[rule];
                }
            }
        }
        if (configuration) {
            this.__configure(name, configuration);
        }
        return this.__instances[name];
    }

    /**
     *
     * @param  name
     * @private
     */
    __updateAppender(name) {
        for (let instance in this.__instances) {
            if (this.__instances[instance].hasAppender(name)) {
                this.__instances[instance].removeAppender(name);
                this.__instances[instance].addAppender(name);
            }

        }
    }
}

module.exports = new Loggers();